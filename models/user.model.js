import { Schema, model } from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

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
            validator: validator.isEmail(valor),                
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const UserModel = model("User",userSchema)
export default UserModel