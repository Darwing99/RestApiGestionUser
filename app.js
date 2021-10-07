const users=require('./routes/usuarios');
const cursos=require('./routes/cursos');
const auth=require('./routes/auth');
const express=require('express');
const mongose=require('mongoose');

const config=require('config');


mongose
.connect(config.get('configDB.HOST'))
// .connect('mongodb://localhost:27017/dbUserCursos')
.then(()=>console.log('conectado...'))
.catch(console.log('error'));


// usuarios
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios',users);
app.use('/api/cursos',cursos);
app.use('/api/auth',auth);
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('API REST FULL, ejecuntandose...');
});