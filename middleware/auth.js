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
