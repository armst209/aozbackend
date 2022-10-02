import { Request, Response } from "express";
import {
  CreateSessionInput,
  GetByUserEmailSessionInput,
} from "../schema/auth.schema";
import {
  signAccessToken,
  signRefreshToken,
  getAllSessions,
  getSessionsById,
  getMostRecentSessionById,
  getSessionId,
} from "../services/sessions.service";
import config from "config";
import { findUserByEmail } from "../services/user.service";
import { verifyJWT } from "../utils/jwt";
import language from "../utils/language";
import { User } from "../models/user.model";
import dayjs from "dayjs";
import { updateSessionById } from "../services/sessions.service";
import getCurrentDateTimeInEST from "../utils/getCurrentDateEST";
import { Session } from "../models/session.model";

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

  const jwtAccessTokenExpireTime = config.get<string>(
    "jwtAccessTokenExpireTime"
  );
  const accessToken = signAccessToken(user, jwtAccessTokenExpireTime);
  res.cookie("tttATkn", accessToken, {
    httpOnly: true,
    maxAge: 300000, //5 minutes
  });

  //sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  res.cookie("tttRTkn", refreshToken, {
    maxAge: 3.154e10, //1 year
    httpOnly: true,

    // secure: true,
    // expires: dayjs().add(10, "days").toDate(),
  });

  //send the tokens
  // return res.send({ accessToken, refreshToken });
  res.status(200).send({
    user: verifyJWT(accessToken, "accessTokenPublicKey")?.payload,
    token: accessToken,
  });
};

export const endSessionHandler = async (req: Request, res: Response) => {
  //@ts-ignore
  const { tttATkn, tttRTkn } = req.cookies;
  const decodedSession = verifyJWT(tttATkn, "accessTokenPublicKey");
  const { payload } = decodedSession;

  const session = getMostRecentSessionById(payload._id);
  console.log(session);

  // const usersSessions: Array<Session> | null = await getSessionsById(
  //   payload?._id
  // );

  // if (!usersSessions) {
  //   return res.status(404).send("Cannot find sessions");
  // }
  // if (usersSessions.length === 0) {
  //   return res.status(200).send("User does not have any sessions ");
  // }

  // // find most recent session
  // const mostRecentSession = usersSessions.at(-1);

  // //
  // const session = console.log(mostRecentSession!._id);

  //@ts ignore
  // const sessionId = mostRecentSession!.id;

  // console.log(sessionId);
  // // getting current date time in EST & converting to string
  // const currentDateTime = getCurrentDateTimeInEST();

  // //updating session end time
  // await updateSessionById(sessionId, currentDateTime);

  res.cookie("tttATkn", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie("tttRTkn", "", {
    maxAge: 0,
    httpOnly: true,
  });

  return res.status(200).send("User has been successfully logged out.");
};

export const getCurrentSessionHandler = async (req: Request, res: Response) => {
  //@ts-ignore
  const user: Session = req.tttATkn;
  return res.send(user);
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

  return res.status(200).send(usersSessions);
};
