const express=require('express');
const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');
// const Joi=require('joi');
const ruta=express.Router();
const Usuario=require('../models/usuarios_model');

ruta.post('/',(req,res)=>{
    Usuario.findOne({email:req.body.email})
    .then(datos=>{
        if(datos){
            const passValido=bcrypt.compareSync(req.body.password,datos.password);
            if(!passValido) return res.status(400).json({
                error:'ok',
                msj:'Usuario o contrasenia incorrecta ',
            })

            // const jwtoken=jwt.sign({_id:datos._id,nombre:datos.nombre,email:datos.email},'password');
            

            const jwToken=jwt.sign({
                data:{_id:datos._id,nombre:datos.nombre,email:datos.email}
            },'secret',{expiresIn:'24h'});
            res.json({
                usuario:{
                    _id:datos._id,
                    nombre:datos.nombre,
                    email:datos.email
                },
                jwToken,
            });
        }else{
            res.status(400).json({
                error:'ok',
                msj:'Usuario o contrasenia incorrecta ',
            })
        }
    })
    .catch(err=>{
        res
        .status(400)
        .json({
            error:'ok',
            msj:'error en el servicio'+err})
    });
});


module.exports=ruta;