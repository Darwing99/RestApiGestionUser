const express =require('express');
const Curso=require('../models/cursos_model');

const Joi=require('joi');
const ruta=express.Router();

ruta.get('/activos',(req,res)=>{
    let resultado=listCursosActivos();
    resultado.then(cursos=>{
        res.json(cursos)
    }).catch(err=>{
        res.status(400).json({
            error:err
        })
    })
});
ruta.post('/',(req,res)=>{
    let resultado=crearCurso(req.body);
    resultado.then(curso=>{
        res.json({curso})
    }).catch(error=>{
        res.status(400).json({error})
    })
});

ruta.put('/:id',(req,res)=>{
    let resultado=updateCurso(req.params.id,req.body);
    //const {error,value}=schema.validate({nombre:req.body.nombre});
   // if(!error){
        resultado.then(valor=>{
            res.json({
                valor:valor
            });
        }).catch(err=>{
            res.status(400).json({error:err});
        })

    // }else{
    //     res.status(400).json({error:error});
    // }
});


ruta.delete('/:id',(req,res)=>{
    let resultado=disableCurso(req.params.id);
    resultado.then(valor=>{
       res.json({
       valor:valor
       })
    }).catch(err=>{
        res.status(400).json({error:err});
    });

});

async function disableCurso(id){
    let curso=await Curso.findByIdAndUpdate({'_id':id},{
        $set:{
            estado:false
        }
    },{new:true});
    return curso;

}
async function crearCurso(body){
    let curso=new Curso({
        titulo          :body.titulo,
        descripcion     :body.descripcion,
        estado          :body.estado,
        imagen          :body.imagen,
        cantidadAlumnos :body.cantidadAlumnos,
        calificacion    :body.calificacion 
    });
    return await curso.save();
}
async function updateCurso(id,body){
    let curso=await Curso.findByIdAndUpdate({'_id':id},{
        $set:{
            titulo      :body.titulo,
            descripcion    :body.descripcion,
            estado          :body.estado,
            imagen          :body.imagen,
            cantidadAlumnos :body.cantidadAlumnos,
            calificacion    :body.calificacion 

        }
    },{new:true});
    return curso;
}

async function listCursosActivos(){
    let cursos=await Curso.find({estado:false});
    return cursos;
}


module.exports=ruta;