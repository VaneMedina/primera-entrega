const express = require('express');
const path = require('path');
const { Router } = express;
const Product = require('../models/product')
const productModel = new Product();
const upload = require('../middlewares/file');
const router = Router();

admin = true

// get all produts
router.get('/', async (req, res) => {
    const products =  await productModel.getAll()
    res.status(200).send(products)    
})

// get product by id
router.get('/:id', async (req, res)=> {
    const product = await productModel.getById(req.params.id)
    res.status(200).send(product)
})

// add new product
router.post("/", upload.single("thumbnail"), async (req, res) =>{
    if(!admin){
        res.status(401)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamada'})
    }else{
        const { name, price, description, code, stock} = req.body;
        const date = Date.now()
        const thumbnail = path.join("static/img/" + req.file.filename)
        const id = await productModel.save({name, date, price, description, code, stock, thumbnail});
        id ? res.status(201).send({success: 'Producto creado con exito'}) : res.status(500).send({error: 'No se pudo crear el producto'})
    }
  })


// update product by id
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    if(!admin){
        res.status(401)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamada'})
    }else{
        const newProduct = {}
        const { name, price, description, code, stock} = req.body;
        const thumbnail = path.join("static/img/" + req.file.filename)
        newProduct.date = Date.now()
        newProduct.name = name
        newProduct.description = description
        newProduct.code = code
        newProduct.thumbnail = thumbnail
        newProduct.price = price
        newProduct.stock = stock
        await productModel.updateById(req.params.id, newProduct) ? res.status(200).send({success: 'Producto actualizado'}) : res.status(404).send({notFound: 'Producto no encontrado'})
    }
})

// delete product by id
router.delete('/:id', async (req, res)=> {
    if(!admin){
        res.status(401)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        await productModel.deleteById(req.params.id) ? res.status(200).send({success: 'Producto eliminado con exito'}) : res.status(404).send({notFound: 'Producto no encontrado'})
    }
})

  module.exports = router;
