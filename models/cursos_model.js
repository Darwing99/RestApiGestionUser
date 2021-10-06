const { number } = require('joi');
const mongoose=require('mongoose');

const cursoSchema=new mongoose.Schema({

    titulo:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    },
    estado:{
        type:Boolean,
        required:true,
        default:true
    },
    imagen:{
        type:String,
        required:false
    },
    cantidadAlumnos:{
        type:Number,
        default:0
    },
    calificacion:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model('Curso',cursoSchema);