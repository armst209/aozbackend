import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import logger from "../utils/logger";
import decodeUser from "../utils/decodeUser";
import { JWTVerifyReturn } from "../utils/interfaces";

const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tttATkn: accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).send("User not authorized.");
  }

  const { payload }: JWTVerifyReturn = verifyJWT(
    accessToken,
    "accessTokenPublicKey"
  );
  const { roles } = payload;

  if (!roles.includes("admin") || !roles.includes("editor")) {
    return res.status(401).send("User not authorized.");
  }

  return next();
};
export default authorizeUser;
