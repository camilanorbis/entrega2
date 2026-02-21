import { Types } from "mongoose";

export default class CartService {

    constructor (cartDao,productDao) {
        this.cartDao = cartDao
        this.productDao = productDao
    }

    async createCart () {
        return await this.cartDao.createCart()
    }

    async getCartWithProducts (cid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) return null
        return cart.populate("products.productId")
    }

    async addProduct (cid, pid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        const product = await this.productDao.getProductByFilter({ _id: pid })
        if(!cart) {
            return ({'error': `El carrito con id ${cid} no existe`})
        }     
        if(!product) {
            return ({'error': `El producto con id ${pid} no existe`})
        }

        const objectPid = new Types.ObjectId(String(pid))
        const result = await this.cartDao.updateCart(
            { _id: cid, "products.productId": objectPid },
            { $inc: { "products.$.quantity": 1 } }
        )
        
        if (result.modifiedCount === 0) {
            await this.cartDao.updateCart(
                { _id: cid },
                { $push: { products: { productId: objectPid, quantity: 1 }}}
            )
        }

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async deleteProduct (cid, pid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        const product = await this.productDao.getProductByFilter({ _id: pid })
        
        if (!cart) {
            return ({'error': `El carrito con id ${cid} no existe` })
        }
        if(!product) {
            return ({'error': `El producto con id ${pid} no existe` })
        }
        
        const objectPid = new Types.ObjectId(String(pid))
        const objectCid = new Types.ObjectId(String(cid))
        await this.cartDao.updateCart(
            { _id: objectCid }, 
            { $pull: { products: { productId: objectPid }}}
        )
        
        return await this.cartDao.getCartByFilter({ _id: cid })

    }

    async updateProductOnCart (cid, pid, quantity) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) {
            return ({ 'error': `El carrito con id ${cid} no existe` })
        }
                
        const objectCid = new Types.ObjectId(String(cid))
        const objectPid = new Types.ObjectId(String(pid))
        const result = await this.cartDao.updateCart({ _id: objectCid, "products.productId": objectPid }, { $set: { "products.$.quantity": quantity }})
                        
        if (result.modifiedCount === 0) 
            return ({ 'error': `El producto con id ${pid} no esta en el carrito` })

        return await this.cartDao.getCartByFilter({ _id: cid })
    }

    async updateAllProducts (cid, newProducts) {
        let result = null
        if (!Array.isArray(newProducts)) {
            result = { 'error': 'El body debe ser un arreglo de productos' }
            return result
        }

        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) {
            result = { 'error': `El carrito con id ${cid} no existe` }
            return result
        }

        await this.cartDao.updateCart({ _id: cid }, { $set: { products: newProducts }})
        result = await this.cartDao.getCartByFilter({ _id: cid })
        return result
    }

    async deleteAllProducts (cid) {
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        if (!cart) {
            return ({ 'error': `El carrito con id ${cid} no existe` })
        } 

        await this.cartDao.updateCart({ _id: cid }, { $set: { products: [] }})
        return await this.cartDao.getCartByFilter({ _id: cid })
    }

}