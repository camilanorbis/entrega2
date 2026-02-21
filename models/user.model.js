import { Schema, model } from "mongoose"
import validator from "validator"

export const userSchema = new Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (valor) => { return validator.isEmail(valor) },          
            message: "Email is not valid"
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart"
    },
    role: {
        type: String,
        default: "user"
    }
})


const UserModel = model("User",userSchema)
export default UserModel