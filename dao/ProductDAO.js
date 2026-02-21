import ProductModel from "../models/product.model.js"

export default class ProductDAO {

    async createProduct (newProduct) {
        return await ProductModel.create(newProduct)
    }

    async modifyProduct (id,productModified) {
        return await ProductModel.updateOne({ _id: id }, { $set: productModified  })
    }

    async getProducts (filter,limit,skip,sort) {
        let consulta
        if (filter){
            consulta = ProductModel.find(filter).limit(limit).skip(skip)
        } else {
            consulta = ProductModel.find().limit(limit).skip(skip)
        }
        if (sort) consulta = consulta.sort({ price: Number(sort) })
        return await consulta
    }

    async getProductByFilter (filter) {
        return await ProductModel.findOne(filter).lean()
    }

    async deleteProduct (id) {
        return await ProductModel.deleteOne({ _id: id })
    }

    //TODO mover a controler?
    async countDocuments (filter) {
        if (filter != null){
            return await ProductModel.countDocuments(filter)
        } 
        return await ProductModel.countDocuments()
    }

}


