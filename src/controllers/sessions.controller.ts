import { Request, Response } from "express";
import {
  CreateUserSessionInput,
  GetByUserEmailSessionInput,
} from "../schema/sessions.schema";
import {
  signAccessToken,
  signRefreshToken,
  getAllSessions,
  getAllUserSessionsById,
  getMostRecentSessionIdByUserId,
  getMostRecentSession,
} from "../services/sessions.service";
import config from "config";
import { findUserByEmail } from "../services/user.service";
import { verifyJWT } from "../utils/jwt";
import language from "../common/language";

import { updateSessionById } from "../services/sessions.service";
import getCurrentDateTimeInEST from "../utils/getCurrentDateEST";

import logger from "../utils/logger";

/**
 * @desc logs user in - creates a session, finds user by email, verifies user then assigns an access and refresh token
 * @param req
 * @param res
 * @returns
 */
export const createSessionHandler = async (
  req: Request<{}, {}, CreateUserSessionInput>,
  res: Response
) => {
  //generic message for client
  const message = language.vagueLoginMessage;
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      logger.error("User is not found");
      return res.status(400).json({ message });
    }

    //verifying user - if user has not followed link in email
    if (!user.isVerified) {
      logger.error("User has not been verified");
      return res.status(400).json({ message: "User is not verified" });
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      logger.error("User is not valid");
      return res.status(400).json({ message });
    }

    //signing access token
    const jwtAccessTokenExpireTime = config.get<string>(
      "jwtAccessTokenExpireTime"
    );
    const accessToken = signAccessToken(user, jwtAccessTokenExpireTime);
    res.cookie("tttATkn", accessToken, {
      httpOnly: true,
      maxAge: 300000, //5 minutes
    });

    //signing refresh token
    const refreshToken = await signRefreshToken({ userId: user._id });

    res.cookie("tttRTkn", refreshToken, {
      maxAge: 3.154e10, //1 year
      httpOnly: true,
      secure: true,
      // expires: dayjs().add(10, "days").toDate(),
    });

    //send the tokens
    res.status(200).json({
      message: "User has successfully logged in.",
    });
  } catch (error) {
    res.status(400).json({ message });
  }
};

/**
 * @desc logs user out - uses cookie tokens from request to update session with current date time and to set isSessionValid to false. Clears cookies in client cookie storage.
 * @param req
 * @param res
 * @returns
 */
export const endSessionHandler = async (req: Request, res: Response) => {
  try {
    //getting token from request cookies
    const { tttATkn } = req.cookies;

    //verifying token
    const decodedSession = verifyJWT(tttATkn, "accessTokenPublicKey");

    //returning session
    const { payload } = decodedSession;

    //getting most recent session id
    const sessionId = await getMostRecentSessionIdByUserId(payload?._id);

    // getting current date time in EST & converting to string
    const currentDateTime = getCurrentDateTimeInEST();

    //updating session end time
    await updateSessionById(sessionId, currentDateTime);

    //setting cookies to empty string
    res.cookie("tttATkn", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.cookie("tttRTkn", "", {
      maxAge: 0,
      httpOnly: true,
    });
    return res
      .status(200)
      .json({ message: "User has been successfully logged out." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not log user out, unknown error" });
  }
};

/**
 * @desc gets currently logged in user - gets cookies from request, verifies jwt
 * @param req
 * @param res
 * @returns currentSession : SessionModel
 */
export const getCurrentSessionHandler = async (req: Request, res: Response) => {
  //@ts-ignore
  const { tttATkn } = req.cookies;
  const decodedSession = verifyJWT(tttATkn, "accessTokenPublicKey");
  const { payload } = decodedSession;
  const currentSession = await getMostRecentSession(payload?._id);
  return res.status(200).json({ currentSession });
};

export const getAllSessionsHandler = async (req: Request, res: Response) => {
  const allSessions = await getAllSessions();

  if (!allSessions) {
    return res.status(404).json({ message: "Error finding sessions" });
  }
  if (allSessions.length === 0) {
    return res.status(200).json({ message: "No sessions available" });
  }
  return res.status(200).json(allSessions);
};

export const getSessionsByUserEmailHandler = async (
  req: Request<GetByUserEmailSessionInput, {}, {}>,
  res: Response
) => {
  const { email } = req.params;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const usersSessions = await getAllUserSessionsById({ userId: user._id });

  if (!usersSessions) {
    return res.status(404).json({ message: "Cannot find sessions" });
  }
  if (usersSessions.length === 0) {
    return res.status(404).json({ message: "User does not have any sessions" });
  }

  return res.status(200).send(usersSessions);
};

export const deleteAllSessionsHandler = async (
  req: Request,
  res: Response
) => {};
