import CartModel from "../models/cart.model.js";


export default class CartDAO {

    async createCart () {
        return await CartModel.create({})
    }

    async getCartByFilter (filter) {
        return await CartModel.findOne(filter)
    }

    async updateCart (filter,update) {
        return await CartModel.updateOne(filter,update)
    }


}