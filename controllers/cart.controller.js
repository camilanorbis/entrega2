import { cartService } from "../service/index.js";

export const createCart = async (req,res) => {
    try {
        const response = await cartService.createCart()

        if (!response) {
            return res.status(400).json({ status: 'error', payload: 'No fue posible crear el carrito' })
        } else {
            return res.status(201).json({ status: 'success', payload: response })
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible crear el carrito. Detalle: ${error}` })
    }
}

export const getCartProducts = async (req,res) => {
    try {
        const { cid } = req.params
        const cart = await cartService.getCartWithProducts(cid)

        if (cart) {
            const response = cart.products;
            return res.status(200).json({ status: 'success', payload: response })
        } else {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` })
        }

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible obtener los productos del carrito ${req.params.cid}` })
    }
}

export const addProductToCart = async (req,res) => {
    try {
        const { pid } = req.params
        const { cid } = req.params 

        const updatedCart = await cartService.addProduct(cid,pid)

        if (!updatedCart)
            return res.status(400).json({ status: 'error', payload: 'No fue posible agregar el producto al carrito.'})
        if (updatedCart.error)
            return res.status(404).json({ status: 'error', payload: updatedCart.error })
        
        return res.status(200).json({ status: 'success', payload: updatedCart });

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible agregar el producto al carrito. Detalle: ${error}` })
    }
}

export const deleteProductFromCart = async (req,res) => {
    try {
        const { cid, pid } = req.params 
        const updatedCart = await cartService.deleteProduct(cid,pid)

        if (!updatedCart)
            return res.status(400).json({ status: 'error', payload: 'No fue posible eliminar el producto del carrito.'})
        if (updatedCart.error)
            return res.status(404).json({ status: 'error', payload: updatedCart.error })

        return res.status(200).json({ status: 'success', payload: updatedCart })
        
    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible eliminar el producto del carrito. Detalle: ${error}` })
    }
}

export const updateCartProducts = async (req,res) => {
    try {
        const { cid } = req.params;
        const newProducts = req.body; 

        const response = await cartService.updateAllProducts(cid, newProducts)
        console.log(response)
        if (!response)
            return res.status(400).json({ status: 'error', payload: 'No fue posible actualizar el carrito.'})
        if (response.error)
            return res.status(404).json({ status: 'error', payload: response.error })

        return res.status(200).json({ status: 'success', payload: response })

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar los productos del carrito. Detalle: ${error}` });
    }
}

export const updateProductQuantity = async (req,res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const updatedCart = await cartService.updateProductOnCart(cid,pid,quantity)
        if (!updatedCart)
            return res.status(400).json({ status: 'error', payload: 'No fue posible actualizar el carrito.'})
        if (updatedCart.error)
            return res.status(404).json({ status: 'error', payload: updatedCart.error })

        return res.status(200).json({ status: 'success', payload: updatedCart })

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar el carrito. Detalle: ${error}` })
    }

}

export const deleteProductsFromCart = async (req,res) => {
    try {
        const { cid } = req.params
        const updatedCart = await cartService.deleteAllProducts(cid)
        console.log(updatedCart)
        if (!updatedCart)
            return res.status(400).json({ status: 'error', payload: 'No fue posible actualizar el carrito.'})
        if (updatedCart.error)
            return res.status(404).json({ status: 'error', payload: updatedCart.error })

        return res.status(200).json({ status: 'success', payload: updatedCart })

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar el carrito. Detalle: ${error}` })
    }
}