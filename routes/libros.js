const express = require("express");
const multer = require('multer');
const { body } = require('express-validator');


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
  }
})

let upload = multer({storage: storage});

let Libro = require(__dirname + "/../models/libro.js");
let Autor = require(__dirname + "/../models/autor.js");
let router = express.Router();



// Servicio de listado general
router.get("/", (req, res) => {
  Libro.find()
    .then((resultado) => {
      res.render("libros_listado", { libros: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error listando libros" });
    });
});
router.get("/nuevo", (req, res) => {
  Autor.find()
    .then((resultado) => {
      res.render("libros_nuevo", { autores: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error listando libros" });
    });
});

router.get("/:id", (req, res) => {
  Libro.findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.render("libro_ficha", { libro: resultado });
      else res.render("error", { error: "Error listando libros" });
    })
    .catch((error) => {
      res.render("error", { error: "Error listando libros" });
    });
});

// Servicio para insertar libros
router.post("/",upload.single('portada'), (req, res) => {
  
  let nuevoLibro = new Libro({
    titulo: req.body.titulo,
    editorial: req.body.editorial,
    precio: req.body.precio,
    autor: req.body.autor,
    portada:req.file ? req.file.filename : null
  });
  
  nuevoLibro
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
       let errores = {
        general: 'Error insertando libro'
       };
       if(error.errors.titulo){
        errores.titulo=error.errors.titulo.message;

       }
       if(error.errors.precio){
        errores.precio=error.errors.precio.message;
       }      
       res.render("libros_nuevo", { errores: errores,datos:req.body});
    });
});
router.get("/editar/:id", (req, res) => {
    Libro.findById(req.params["id"]).then((rese) => {
      if (rese) {
        Autor.find().then((resultado) => {
            res.render("libros_editar", { libro: rese ,autores:resultado});
        });
        
      } else {
        res.render("error", { error: "Autores no encontrado" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "libro no encontrado" });
    });
});

// Servicio para modificar libros
router.put("/:id", (req, res) => {
  Libro.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio,
        autor: req.body.autor,
        portada:req.body.portada
      },
    },
    {new: true}).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error modificando contacto"});
    });
});



// Servicio para borrar libros
router.delete("/:id", (req, res) => {
  Libro.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error borrando contacto" });
    });
});

module.exports = router;
