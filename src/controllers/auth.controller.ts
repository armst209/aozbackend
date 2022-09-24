import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";
import language from "../utils/language";

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  const message = language.vagueLoginMessage;
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.isVerified) {
    return res.send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  //sign an access token
  const accessToken = signAccessToken(user);

  //sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });
  //send the tokens
  return res.send({ accessToken, refreshToken });
};
