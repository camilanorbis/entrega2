/*export const rootHandler = async (req,res) => {
    try {
        const productDao = req.app.locals.productDAO;
        const products = JSON.parse(await productDao.getProducts());

        res.render("home", { products });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }    
}*/

export const getRealTimeProducts = async (req,res) => {
    try {
        const productManager = req.app.locals.productManager;
        const fileContent = await productManager.getProducts();
        if (fileContent != null) {
            const products = JSON.parse(fileContent);
            res.render("realTimeProducts", {products})
        } else {
            res.status(400).json({ status: 'error', result: 'No fue posible obtener los productos' })
        }
    } catch (error) {
        res.status(500).json({ status: 'error', result: `Error al obtener los productos. Detalle: ${error}` });
    }
}