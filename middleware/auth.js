import jwt from "jsonwebtoken";
import passport from "passport";

//deprecated
export const authJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status:'error', payload:'No hay usuario autenticado' });
    }

    try {
        const jwtContent = jwt.verify(token, process.env.JWT_SECRET);
        req.user = jwtContent;
        next();
    } catch (error) {
        return res.status(401).json({ status:'error', payload:'Token inválido' });
    }
};

export const passportCurrent = (req, res, next) => {
  passport.authenticate("current", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({ status:'error', payload:'Token inexistente o inválido' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeRole = (...allowedRoles) => {
  return (req,res,next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', payload: 'Usuario no autorizado'})
    }
    next()
  }
}

export const authorizeCartOwner = (req,res,next) => {
  const { cid } = req.params

  if (!req.user) {
    return res.status(401).json({ status: 'error', payload: 'No autenticado' })
  }

  if (req.user.cart.toString() !== cid) {
    return res.status(403).json({ status: 'error', payload: 'No autorizado para este carrito' })
  }

  next()

}