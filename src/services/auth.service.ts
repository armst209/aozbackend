import { DocumentType } from "@typegoose/typegoose";
import SessionModel from "../models/session.model";
import { privateFields, User } from "../models/user.model";
import { signJWT } from "../utils/jwt";
import { omit } from "lodash";
import config from "config";

export const createSession = ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId });
};
export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const jwtExpireTime = config.get<string>("jwtTokenExpireTime");
  const session = await createSession({ userId });

  const refreshToken = signJWT(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey",
    { expiresIn: jwtExpireTime }
  );
  return refreshToken;
};

export const signAccessToken = (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJWT(payload, "accessTokenPrivateKey");

  return accessToken;
};
