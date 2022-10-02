import jwt from "jsonwebtoken";
import config from "config";
import { User } from "../models/user.model";
import { Session } from "../models/session.model";
import { JWTVerifyReturn } from "./interfaces";

export const signJWT = (
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");
  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJWT = (
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): JWTVerifyReturn => {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey) as any;

    return { payload: decoded, expired: false };
  } catch (error: any) {
    return { payload: null, expired: error.message.includes("JWT expired") };
  }
};
