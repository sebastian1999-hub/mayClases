const mongoose = require('mongoose');

let comentarioSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: new Date()
    },
    nick: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    texto: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

let libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El nombre del libro es obligatorio'],
        minlength:[3, 'El nombre del libro es demasiado corto'],
        trim: true          // Esto no se pedía en el enunciado
    },
    editorial: {
        type: String
    },
    precio: {
        type: Number,
        required: [true, 'El precio del libro es obligatorio'],
        min: [0, 'El precio del libro no puede ser menor que 0']
    },
    portada: {
        type: String
    },
    // Vinculación de libro con autor
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'autores'
    },
    // Vinculación de libro con comentarios (subdocumento)
    comentarios: [comentarioSchema]
});

let Libro = mongoose.model('libros', libroSchema);
module.exports = Libro;
