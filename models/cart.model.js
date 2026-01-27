import { Schema, model } from "mongoose";

//Schema
const cartSchema = new Schema({
    //id se crea automaticamente.
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
})


//Modelo
const CartModel = model("Cart", cartSchema)

export default CartModel;