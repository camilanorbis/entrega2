import CartModel from "../models/cart.model.js";
import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";

const cartManager = new CartManager()
const productManager = new ProductManager()

export const createCart = async (req,res) => {
    try {
        const response = await cartManager.createCart()

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
        const cart = await cartManager.getCartByIdAndPopulate(cid)

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

        const cart = await cartManager.getCartById(cid)
        const product = await productManager.getProductById(pid)

        if(!cart) {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` })
        } 
        console.log(product)
        if(!product) {
            return res.status(404).json({ status: 'error', payload: `El producto con id ${pid} no existe` })
        }
        
        const productInCart = cart.products.find(product => product.productId === pid);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ productId: pid,quantity: 1 });
        }

        const updated = await cartManager.saveCart(cart)
        return res.status(200).json({ status: 'success', payload: updated });

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible agregar el producto al carrito. Detalle: ${error}` })
    }
}

export const deleteProductFromCart = async (req,res) => {
    try {
        const { cid, pid } = req.params 
        const cart = await cartManager.getCartById(cid)

        if (!cart) {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` })
        }

        await cartManager.deleteProductFromCart(pid,cid)
        const updatedCart = await cartManager.getCartById(cid)
        return res.status(200).json({ status: 'success', payload: updatedCart })

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible eliminar el producto del carrito. Detalle: ${error}` })
    }
}

export const updateCartProducts = async (req,res) => {
    try {
        const { cid } = req.params;
        const newProducts = req.body; 

        if (!Array.isArray(newProducts)) {
            return res.status(400).json({ status: 'error', payload: 'El body debe ser un arreglo de productos' });
        }

        const cart = await cartManager.updateCartProducts(cid,newProducts)

        if (!cart) {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` });
        }

        return res.status(200).json({ status: 'success', payload: cart });

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar los productos del carrito. Detalle: ${error}` });
    }
}

export const updateProductQuantity = async (req,res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const cart = await cartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` })
        }
        
        const productInCart = cart.products.find(product => product.productId === pid);
        if (productInCart) {
            productInCart.quantity = quantity
            await cartManager.saveCart(cart)
            return res.status(200).json({ status: 'success', payload: cart })
        } else {
            return res.status(404).json({ status: 'error', payload: `El producto con id ${pid} no esta en el carrito` })
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar el carrito. Detalle: ${error}` })
    }

}

export const deleteProductsFromCart = async (req,res) => {
    try {
        const { cid } = req.params
        const cart = await cartManager.updateCartProducts(cid,[])

        if (!cart) {
            return res.status(404).json({ status: 'error', payload: `El carrito con id ${cid} no existe` })
        } 

        return res.status(200).json({ status: 'success', payload: cart })

    } catch (error) {
        return res.status(500).json({ status: 'error', payload: `No fue posible actualizar el carrito. Detalle: ${error}` })
    }
}