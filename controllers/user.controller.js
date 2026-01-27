export const createUser = async (req,res) => {
    try {

    } catch (error) {
        res.status(500).json({status:'error',payload:'No fue posible crear el usuario'})                    
    }
}