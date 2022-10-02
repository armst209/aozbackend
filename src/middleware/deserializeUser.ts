import { Request, Response, NextFunction } from "express";
import { JWTVerifyReturn } from "../utils/interfaces";
import { verifyJWT } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tttATkn: accessToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload }: JWTVerifyReturn = verifyJWT(
    accessToken,
    "accessTokenPublicKey"
  );

  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }
  return next();
};
export default deserializeUser;
