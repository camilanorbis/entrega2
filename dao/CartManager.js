import CartModel from "../models/cart.model.js";


export default class CartManager {

    async createCart () {
        return await CartModel.create({})
    }

    async getCartById (id) {
        return await CartModel.findById(id)
    }

    async getCartByIdAndPopulate (id) {
        return await CartModel.findById(id).populate("products.productId")
    }

    async saveCart (cart) {
        return await cart.save();
    }

    async deleteProductFromCart (productId,cartId) {
        return await CartModel.updateOne( { _id: cartId }, { $pull: { products: { productId: String(productId).trim() } } });
    }

    async updateCartProducts (cartId,newProducts) {
        return await CartModel.findByIdAndUpdate(cartId, { $set: { products: newProducts } }, { new: true });
    }



}