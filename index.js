const express = require('express')
const path = require('path');
const http = require('http')
const productsRouter = require("./routes/products")
const cartRouter = require('./routes/cart');

const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT | 8080


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/static", express.static(path.join(__dirname, 'public')))

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);


server.listen(PORT, () => console.log(`listening on port: ${PORT}`))