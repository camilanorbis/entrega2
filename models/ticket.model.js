import { Schema, model } from 'mongoose'

export const ticketSchema = new Schema ({
    nroComp: {
        type: String,
        unique: true,
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type:Number,
                required: true
            }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    date: {
        type: Date, 
        required: true 
    },
    totalAmount: {
        type: Number,
        required: true
    }
})

const TicketModel = model("Ticket", ticketSchema)

export default TicketModel