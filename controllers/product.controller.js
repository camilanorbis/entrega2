import ProductManager from "../dao/ProductManager.js";

const productManager = new ProductManager();

export const addProduct = async (req,res) => {
    try {
        const product = req.body;
        const response = await productManager.addProduct(product)
        return res.status(201).json({ status: 'success', payload: response === null ? 'Faltan campos o hay formatos inválidos' : response })
    } catch (error) {
        if (error.name === "ValidationError") {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ status: 'error', payload: mensajes.join(", ") });
        }
        return res.status(500).json({ status: 'error', payload: 'No fue posible agregar el producto a la base de datos'})
    }
}

export const getProducts = async (req,res) => {
    try {
        let { limit = 10, page = 1, query, sort } = req.query
        let filter = {}
        
        limit = Number(limit)
        page = Number(page)
        const skip = limit * (page - 1)
        if (query) {
            const [key, value] = query.split(":");
            filter[key] = value; 
        }   

        const totalPages = await getTotalPages(filter,limit)
        const hasPrevPage = page > 1
        const  hasNextPage = page < totalPages

        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

        const prevLink = hasPrevPage
            ? `${baseUrl}?limit=${limit}&page=${page - 1}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
            : null;

        const nextLink = hasNextPage
            ? `${baseUrl}?limit=${limit}&page=${page + 1}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
            : null;

        const response = await productManager.getProducts(filter,limit,skip,sort);
        return res.status(200).json({ 
            status: 'success', 
            payload: response, 
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page, 
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        })
    } catch (error){
        return res.status(500).json({ status: 'error', payload: `No fue posible obtener los productos de la base de datos. Detalle: ${error}`})
    }
}

export const getProductById = async (req,res) => {
    try {
        const { pid } = req.params
        const response = await productManager.getProductById(pid)
        return res.status(200).json({ status: 'success', payload: response != null ? response : `El producto con id ${pid} no existe`})
    } catch (error) {
        return res.status(500).json({ status: 'error', payload: 'No fue posible obtener el producto'})
    }
}

export const modifyProduct = async (req,res) => {
    try {
        const { pid } = req.params
        const product = req.body
        const response = await productManager.modifyProduct(pid,product)

        if (response) {
            return res.status(200).json({ status: 'success', payload: `El producto con id ${pid} fue modificado correctamente` })
        } else {
            return res.status(404).json({ status: 'error', payload: `El producto con id ${pid} no existe o el campo que intenta modificar no forma parte del producto.` })
        }

    } catch (error) {
        if (error.name === "ValidationError") {
            const mensajes = Object.values(error.errors).map(err => err.message);

            return res.status(400).json({ status: 'error', payload: mensajes.join(", ") });
        }
        console.log(error)
        return res.status(500).json({ status: 'error', payload: `No fue posible modificar el producto con id ${req.params.pid}`})
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const { pid } = req.params
        const product = await productManager.getProductById(pid)

        if (product) {
            const response = await productManager.deleteProduct(pid)
            if (response.acknowledged) {
                return res.status(200).json({ status: 'success', payload: `El producto con id ${pid} fue eliminado correctamente.` })
            } else {
                return res.status(400).json({ status: 'error', payload: `El producto con id ${pid} no pudo ser eliminado.` })
            }
        } else {
            return res.status(400).json({ status: 'error', payload: `El producto con id ${pid} no existe.` })
        }

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible eliminar el producto con id ${req.params.pid}` })
    }
}

export const getTotalPages = async (filter,limit) => {
    let totalDocs
    if (filter) {
        totalDocs = await productManager.countDocuments(filter)
    } else {
        totalDocs = await productManager.countDocuments(null)
    }
    return Math.ceil(totalDocs / limit)
}