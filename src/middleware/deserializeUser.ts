import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }

  if (!accessToken) {
    return res.status(401).send("User not authorized");
  }

  const decoded = verifyJWT(accessToken, "accessTokenPublicKey");
  if (decoded) {
    res.locals.user = decoded;
  }
  return next();
};
export default deserializeUser;
