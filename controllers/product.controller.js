import ProductDAO from "../dao/ProductDAO.js";

const productDao = new ProductDAO();

export const createProduct = async (req,res) => {
    try {
        const product = req.body;
        if (!validateProduct(product)){
            return res.status(400).json({ status:'error', payload:'Faltan campos o hay formatos inválidos'})
        }
        const response = await productDao.createProduct(product)
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

        const response = await productDao.getProducts(filter,limit,skip,sort);
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
        const response = await productDao.getProductByFilter({ _id: pid })
        return res.status(200).json({ status: 'success', payload: response != null ? response : `El producto con id ${pid} no existe`})
    } catch (error) {
        return res.status(500).json({ status: 'error', payload: 'No fue posible obtener el producto'})
    }
}

export const modifyProduct = async (req,res) => {
    try {
        const { pid } = req.params
        const product = req.body
        const response = await productDao.modifyProduct(pid,product)

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
        const product = await productDao.getProductByFilter({ _id: pid })

        if (product) {
            const response = await productDao.deleteProduct(pid)
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
        totalDocs = await productDao.countDocuments(filter)
    } else {
        totalDocs = await productDao.countDocuments(null)
    }
    return Math.ceil(totalDocs / limit)
}

const validateProduct = (product) => {
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