const express=require('express');
const bcrypt=require('bcrypt');
const Joi=require('joi');
const ruta=express.Router();
const Usuario=require('../models/usuarios_model');




const schema = Joi.object({
    nombre: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  

    // access_token: [
    //     Joi.string(),
    //     Joi.number()
    // ],

 

    email: Joi.string()
        
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

ruta.get('/activos',(req,res)=>{
  let resultado=listUserActivos();
    resultado.then(usuarios=>{
        res.json(usuarios)
    }).catch(err=>{
        res.status(400).json({
            error:err
        })
    })

});

async function listUserActivos(){
    let usuarios=await Usuario
                        .find({estado:true})
                        .select({nombre:1,email:1});
    return usuarios;
}


ruta.put('/:email',(req,res)=>{
    let resultado=updateUser(req.params.email,req.body);
    const {error,value}=schema.validate({nombre:req.body.nombre});
    if(!error){
        resultado.then(valor=>{
            res.json({
                nombre:valor.nombre,
                email:valor.email
            });
        }).catch(err=>{
            res.status(400).json({error:err});
        })

    }else{
        res.status(400).json({error:error});
    }
   
});

async function updateUser(email,body){
    let user=await Usuario.findOneAndUpdate({'email':email},{
        $set:{
            nombre      :body.nombre,
            password    :bcrypt.hashSync( body.password,10)
        }
    },{new:true});
    return user;

}


ruta.post('/',(req,res)=>{
    let body=req.body;
    Usuario.findOne({email:body.email},(err,user)=>{
        if(err){
            return res.status(400).json({error:'Server Error'});
        }if(user){
            return res.status(400).json({
                msj:'EL Usuario ya existe'
            });
        }
    });
    const {error,value}=schema.validate({nombre:body.nombre,email:body.email});
    if(!error){
        let result=crearUser(body);
        result.then( user =>{
            res.json({
                nombre:user.nombre,
                email:user.email
            });

        }).catch(err=>{
            res.status(400).json({
                error:err
            });
        });
    }else{
        res.status(400).json({
            error:error
        })
    }
   
});


async function crearUser(body){
    let usuario=new Usuario({
        email       :body.email,
        nombre      :body.nombre,
        password    :bcrypt.hashSync( body.password,10)
    });
    return await usuario.save();
}



ruta.delete('/:email',(req,res)=>{
    let resultado=enableUser(req.params.email);
    resultado.then(valor=>{
       res.json({
       nombre:valor.nombre,
       email:valor.email
       })
    }).catch(err=>{
        res.status(400).json({error:err});
    });

});

async function enableUser(email){
    let usuario=await Usuario.findOneAndUpdate({'email':email},{
        $set:{
            estado:false
        }
    },{new:true});
    return usuario;

}



module.exports=ruta;

