import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { User } from "../models/user.model";
import {
  CreateUserInput,
  ForgotPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
} from "../services/user.service";
import logger from "../utils/logger";

import { runMCPingTest, subscribeUserToMClist } from "./mailer.controller";

//remember body is the 3rd input for the type
export const getAllUsersHandler = async (req: Request, res: Response) => {
  const allUsers = await getAllUsers();

  if (!allUsers) {
    return res.status(404).send("No available users");
  }
  res.status(200).json(allUsers);
};

/**
 * @desc creates a new user and sends verification email to user
 * @param req
 * @param res
 * @returns 200 status if user has been successfully created
 */
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const body = req.body;

  try {
    // const user = await createUser(body);
    // console.log(body);

    //subscribe to mailing list
    subscribeUserToMClist(res, body);
    //not checking for if the user exists because of the unique constraint on the model
    res.status(200).send("User successfully created");
  } catch (error: any) {
    //code for a unique constraint has been violated
    if (error.code === 11000) {
      res.status(409).send("User/Account already exists"); //conflict
    }
    logger.error(error);
    return res.status(500).send(error);
  }
};

/**
 * @desc verifies user by checking isVerified and verificationCode
 * @param req
 * @param res
 * @returns 200 status if user is verified, 404 if user is not found, 400 if user cannot be verified
 */
export const verifyUserByEmailHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //finding user by id
  const user = await findUserById(id);
  console.log(user);
  if (!user) {
    res.status(404).send("User not found. Could not verify user");
  }

  //checking to see if user is already verified
  if (user?.isVerified) {
    return res.send("User is already verified");
  }

  ///checking if verification code matches
  if (user?.verificationCode === verificationCode) {
    user.isVerified = true;
    //saving in document
    await user.save();
    return res.status(200).send("User successfully verified");
  }

  return res.status(400).json("Could not verify user");
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  //so users don't keep spamming this endpoint to see which emails are registered or not
  const message =
    "If a user with that email is registered you will receive a password reset email";
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`User with email ${email} does not exist`);
    return res.send(message);
  }

  if (!user.isVerified) {
    return res.sendStatus(400).send("User is not verified");
  }

  //generating new password reset code & saving document
  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;
  await user.save();

  //send email

  logger.debug(`Password reset email sent to ${email}`);

  return res.sendStatus(200).send(message);
};
