import ProductModel from "../models/product.model.js"

export default class ProductManager {

    async addProduct (newProduct) {
        if (!this.validateProduct(newProduct)){
            return null
        }
        return await ProductModel.create(newProduct)
    }

    validateProduct(product) {
        const { title, description, code, price, status, stock, category, thumbnails } = product;

        if (!title || !description || !code || price == null || stock == null || !category || !thumbnails) {
            return false;
        }

        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            typeof price !== 'number' ||
            typeof stock !== 'number' ||
            typeof status !== 'boolean' ||
            typeof category !== 'string' ||
            !Array.isArray(thumbnails) ||
            !thumbnails.every(t => typeof t === 'string')
        ) {
            return false;
        }

        return true;
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

    async getProductById (id) {
        return await ProductModel.findById(id)
    }

    async deleteProduct (id) {
        return await ProductModel.deleteOne({ _id: id })
    }

    async countDocuments (filter) {
        if (filter != null){
            return await ProductModel.countDocuments(filter)
        } 
        return await ProductModel.countDocuments()
    }

}


