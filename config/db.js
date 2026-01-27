import mongoose from "mongoose"

export const connectDB = async(url,dbName) => {
    try {
        await mongoose.connect(url,{dbName})
        console.log(`🚀 ~ init ~ mongoose.connected`)
    } catch (error){
        console.log("🚀 ~ init ~ error:", error)
    }
}