import { DocumentType } from "@typegoose/typegoose";
import SessionModel, { Session } from "../models/session.model";
import { privateFields } from "../models/user.model";
import { signJWT } from "../utils/jwt";
import { omit } from "lodash";
import config from "config";
import { User } from "../models/user.model";

export function getAllSessions() {
  return SessionModel.find();
}

export function getSessionsById(id: string) {
  return SessionModel.find().where(id);
}
export async function getMostRecentSessionIdByUserId(id: string) {
  const sessions = await SessionModel.find().where(id);
  return sessions.at(-1)!._id;
}

export function getSessionId(session: Session) {
  return SessionModel.find(session)._id;
}

export function updateSessionById(id: string, payload: Date) {
  return SessionModel.findByIdAndUpdate(id, {
    sessionEndedAt: payload,
    isSessionValid: false,
  });
}

export const createSession = ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId });
};

export const deleteSession = ({ userId }: { userId: string }) => {
  return SessionModel.findByIdAndDelete({ user: userId });
};

export function deleteAllUserSessions(id: string) {
  return SessionModel.deleteMany().where(id);
}
export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const jwtExpireTime = config.get<string>("jwtRefreshTokenExpireTime");
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

export const signAccessToken = (
  user: DocumentType<User>,
  expiresIn: string | number
) => {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJWT(payload, "accessTokenPrivateKey", { expiresIn });

  return accessToken;
};
