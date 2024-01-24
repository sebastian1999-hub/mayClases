/*
Ejercicio de desarrollo de servicios con Express. Sobre la base de datos de "libros" de  
sesiones anteriores, se desarrollarán los servicios básicos paras operaciones habituales de
GET, POST, PUT y DELETE. En este caso, dejamos hechas las operaciones tipo GET.

En esta versión del ejercicio, se estructura el código en carpetas separadas para modelos
y enrutadores
*/

// Carga de librerías
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const nunjucks = require('nunjucks');

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores'); // Para la parte opcional

// Conectar con BD en Mongo 
mongoose.connect('mongodb://127.0.0.1:27017/libros');

// Inicializar Express

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.set('view engine', 'njk');
app.use('/public' ,express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/libros', libros);
app.use('/autores', autores) 

app.listen(8080);