const fs = require('fs').promises;
const path = require('path');
const dbName = path.join(__dirname, "../public/database/carts.json")
class Cart {
    constructor() {
        this.nombreArchivo = dbName;
    }

    async save() {
        let cart = {
            id: 0,
            createDate: Date.now(),
            products : []
        }
        try {
                const carts = await readFile()
                if (carts.length === 0){
                    cart.id = 0
                } else {
                    cart.id = carts[carts.length - 1].id + 1
                }
                carts.push(cart);
                const allCarts = JSON.stringify(carts, null, 2);
                await writeFile(allCarts)
                return cart.id;
        } catch (error) {
            return error;
        }
    }

    async deleteCartById(id) {
        try {
            const carts = await readFile();
            const cart = carts.find(cart => cart.id == id);
            if (!cart) {
                return false
            }else{
                const index = carts.indexOf(cart)
                carts.splice(index, 1)
            }
            const newCart = JSON.stringify(carts, null, 2)
            await writeFile(newCart)
            return true
        } catch (error) {
            return error
        }
    }
    
    async getProductsFromCart(id){
        try {
            const carts = await readFile();
            const cartById = carts.find(cart => cart.id == id)
            return cartById.products
        } catch (error) {
            return error
        }
    }

    async addProductToCart(id, product){
        try {
            const carts = await readFile()
            const cartById = carts.find(cart => cart.id == id)
            const index = carts.indexOf(cartById)
            const cartProducts = cartById.products
            const validateProd = cartProducts.find(prodct => prodct.id === product.id)
            const indexProd = cartProducts.indexOf(validateProd)
            if(validateProd){
                let cant = 1
                validateProd.cant = cant+1
                cartProducts.splice(indexProd, 1, validateProd)
                carts.splice(index, 1, cartById)


            }else{
                cartById.products.push(product)
                carts.splice(index, 1, cartById)
            }
            
            const newCart = JSON.stringify(carts, null, 2);
            writeFile(newCart)
            return 
        } catch (error) {
            return error
        }
    }

    async deleteProductFromCart(idC, idP) {
        try {
            const carts = await readFile();
            const cart = carts.find(cart => cart.id == idC);
            if (!cart) {
                return error;
            }

            const allProducts = cart.products
            const product = allProducts.find(product => product.id == idP)
            if(product.cant > 1){
                product.cant = product.cant-1
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1, product)
            }else{
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1)
            }
            const cartUpdated = JSON.stringify(carts, null, 2)
            await writeFile(cartUpdated)
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
module.exports = Cart