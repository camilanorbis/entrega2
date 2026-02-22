import { Types } from "mongoose";
import { nanoid } from "nanoid";
import TicketDTO from "../DTO/TicketDTO.js";

export default class CartService {

    constructor (cartDao,productDao,ticketDao) {
        this.cartDao = cartDao
        this.productDao = productDao
        this.ticketDao = ticketDao
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

    async generatePurchase (cid,user) {
        //obtengo carrito
        const cart = await this.cartDao.getCartByFilter({ _id: cid })
        await cart.populate("products.productId")
        if (!cart) {
            return ({ 'error': `El carrito con id ${cid} no existe` })
        }

        //chequeo que cada producto tenga el stock necesario, si no lo tiene lo saco del carrito
        for (const item of cart.products) {
            const product = item.productId
            
            if (product.stock < item.quantity) {
                cart.products = cart.products.filter(p => p !== item)
            }
        }

        //resto el stock de los productos del carrito
        for (const item of cart.products) {
            await this.productDao.modifyProduct(item.productId._id, { $inc: { stock: -item.quantity }})
        }

        //calculo precio total del ticket
        let totalAmount = 0
        for (const item of cart.products) {
            totalAmount += item.productId.price * item.quantity
        }

        //genero el ticket 
        const newTicket = await this.ticketDao.createTicket ({
            ticketNumber: nanoid(8),
            products: cart.products.map(p => ({
                productId: p.productId._id,
                quantity: p.quantity
            })),
            userId: user._id,
            date: new Date(),
            totalAmount
        })

        // populo el usuario y productos para poder obtener el ticket final para el dto. 
        const ticketDoc = await this.ticketDao.getTicketByFilter(
                                                        { _id: newTicket._id },
                                                        true,
                                                        [
                                                            { path: "products.productId", select: "title" },
                                                            { path: "userId", select: "first_name last_name" }
                                                        ]
                                                    )

        //vaciar carrito
        await this.cartDao.updateCart({ _id: cid }, { $set: { products: [] }})

        return new TicketDTO(ticketDoc)
    }

}