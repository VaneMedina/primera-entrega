const fs = require('fs').promises;
const path = require('path');
const dbName = path.join(__dirname, "../public/database/products.json")
class Product {
    constructor() {
        this.fileName = dbName;
    }

    async save(name, date, price, description, code, stock, thumbnail) {
        let product = {
            id: 0,
            date: date,
            name: name,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock
        }
        let newProducts = [];
        try {
                const products = await readFile()
                newProducts = products
                if (newProducts.length === 0){
                    product.id = 0
                } else {
                    product.id = newProducts[newProducts.length - 1].id + 1
                }
                newProducts.push(product)
                const allProducts = JSON.stringify(newProducts, null, 2);
                await writeFile(allProducts)
                return product.id;
        } catch (error) {
            return error;
        }
    }

    async getAll() {
        try {
            const products = await readFile()
            return products;
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id)
            if (product) {
                return product;
            }else{
                return {notFound: "Producto no encontrado"}
            }
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id)
            if (!product) {
                return false
            }else{
                const index = products.indexOf(product)
                products.splice(index, 1)
                const newProducts = JSON.stringify(products, null, 2);
                await writeFile(newProducts)
                return true
            }
        } catch (error) {
            return error
        }
    }

    async updateById(id, newProduct) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id);
            if(!product){
                return false
            }else{
                const index = products.indexOf(product)
                newProduct.id = product.id 
                products.splice(index, 1, newProduct)
                const updatedProducts = JSON.stringify(products, null, 2);
                await writeFile(updatedProducts)
                return true
            }
        } catch (error) {
            return error
        }
    }
}

async function readFile (){
    const data = await fs.readFile(dbName)
    return JSON.parse(data);
}

async function writeFile(data){
    await fs.writeFile(dbName, data, 'utf-8')
    return
}
module.exports = Product;