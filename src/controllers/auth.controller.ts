import { Request, Response } from "express";
import {
  CreateSessionInput,
  EndSessionInput,
  GetByUserEmailSessionInput,
} from "../schema/auth.schema";
import {
  signAccessToken,
  signRefreshToken,
  getAllSessions,
  getSessionsById,
  updateSessionById,
} from "../services/auth.service";
import { findUserByEmail, findUserByUserName } from "../services/user.service";
import { verifyJWT } from "../utils/jwt";
import language from "../utils/language";
import { User } from "../models/user.model";
import { Session } from "../models/session.model";
import dayjs from "dayjs";
import getCurrentDateTimeInEST from "../utils/getCurrentDateEST";

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  const message = language.vagueLoginMessage;
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(400).send(message);
  }

  if (!user.isVerified) {
    return res.status(400).send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.status(400).send(message);
  }

  //sign an access token
  const accessToken = signAccessToken(user);

  //sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });
  //send the tokens
  return res.send({ accessToken, refreshToken });
};

export const endSessionHandler = async (
  req: Request<{}, {}, EndSessionInput>,
  res: Response
) => {
  //getting token from body
  const { token } = req.body;

  //decoding token
  const user: User | null = await verifyJWT(token, "accessTokenPublicKey");

  //finding all sessions from user
  const usersSessions = await getSessionsById(user?._id);

  if (!usersSessions) {
    return res.status(404).send("Cannot find sessions");
  }
  if (usersSessions.length === 0) {
    return res.status(200).send("User does not have any sessions ");
  }

  //find most recent session
  const mostRecentSession = usersSessions.at(-1);

  const sessionId = mostRecentSession!._id;

  //getting current date time in EST & converting to string
  const currentDateTime = getCurrentDateTimeInEST();

  //updating session end time
  await updateSessionById(sessionId, currentDateTime);

  return res.status(200).send("User has been successfully logged out");
};
export const getAllSessionsHandler = async (req: Request, res: Response) => {
  const allSessions = await getAllSessions();

  if (!allSessions) {
    return res.status(404).send("Cannot find sessions");
  }
  if (allSessions.length === 0) {
    return res.status(200).send("No sessions available");
  }
  return res.status(200).send(allSessions);
};

export const getSessionsByUserEmail = async (
  req: Request<{}, {}, GetByUserEmailSessionInput>,
  res: Response
) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const usersSessions = await getSessionsById(user.id);

  if (!usersSessions) {
    return res.status(404).send("Cannot find sessions");
  }
  if (usersSessions.length === 0) {
    return res.status(200).send("User does not have any sessions ");
  }
  console.log(usersSessions);
  return res.status(200).send(usersSessions);
};
