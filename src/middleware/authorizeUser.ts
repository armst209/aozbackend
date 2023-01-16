import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { JWTVerifyReturn } from "../common/interfaces";
import { checkPublicRoutes } from "../routes/routeTypes";

const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tttATkn: accessToken } = req.cookies;

  if (checkPublicRoutes(req)) {
    return next();
  }

  if (!accessToken) {
    return res.status(401).json({ message: "User not authorized." });
  }

  const { payload }: JWTVerifyReturn = verifyJWT(
    accessToken,
    "accessTokenPublicKey"
  );
  const { roles } = payload;

  if (!roles.includes("admin") || !roles.includes("editor")) {
    return res.status(401).json({ message: "User not authorized." });
  }

  return next();
};
export default authorizeUser;
