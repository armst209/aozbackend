import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { User } from "../models/user.model";
import sendEmail from "./mailer.controller";
import language from "../common/language";

import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ResetPasswordParams,
  UpdateUserRoleSchema,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
} from "../services/user.service";
import logger from "../utils/logger";
import { userRoles } from "../validation/user.validation";

import { runMCPingTest, subscribeUserToMClist } from "./mailer.controller";

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const allUsers = await getAllUsers();

  if (!allUsers) {
    return res.status(404).json({ message: "Error finding users" });
  }
  if (allUsers.length === 0) {
    return res.status(200).json({ message: "No available users" });
  }
  return res.status(200).json(allUsers);
};

export const getUserById = async () => {};
export const getUserByEmail = async () => {};
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
    const user = await createUser(body);

    //subscribe to mailing list
    // subscribeUserToMClist(res, body);

    //nodemailer
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `Verification Code: ${user.verificationCode}. Id: ${user.id}`,
    });

    //not checking for if the user exists because of the unique constraint on the model
    return res.status(200).json({ message: "User successfully created" });
  } catch (error: any) {
    //code for a unique constraint has been violated
    if (error.code === 11000) {
      return res.status(409).json({ message: "Account already exists" }); //conflict
    }
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRoleHandler = async (
  req: Request<{}, {}, UpdateUserRoleSchema>,
  res: Response
) => {
  //find user
  const { email, role } = req.body;
  let user = await findUserByEmail(email);

  //user not found
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  //user is already has role
  if (user.roles.includes(role)) {
    return res.status(400).json({ message: `User is already a ${role}.` });
  }

  //role is not found
  if (!userRoles.includes(role)) {
    return res.status(404).json({ message: "Role not found." });
  }

  //update user roles
  try {
    switch (role) {
      case "admin":
        const oldUserRoles = user.roles.filter((role) => role !== "user");
        user.roles = [...oldUserRoles, role];
        user.isAdmin = true;
        await user?.save();
        break;
      case "user":
        const oldAdminRoles = user.roles
          .filter((role) => role !== "admin")
          .filter((role) => role !== "editor");
        user.roles = [...oldAdminRoles, role];
        user.isAdmin = false;
        await user?.save();
        break;
      case "editor":
        const oldUserAdminRoles = user.roles.filter((role) => role !== "user");
        user.roles = [...oldUserAdminRoles, role];
        await user?.save();
        break;
      default:
        return res
          .status(400)
          .json({ message: "User's role could not be updated" });
    }
    return res
      .status(200)
      .json({ message: "User's role has been successfully updated" });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: "User's role could not be updated" });
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

  if (!user) {
    res.status(404).json({ message: "User not found. Could not verify user" });
  }

  //checking to see if user is already verified
  if (user?.isVerified) {
    return res.json({ message: "User is already verified" });
  }

  ///checking if verification code matches
  if (user?.verificationCode === verificationCode) {
    user.isVerified = true;
    //saving in document
    await user.save();
    return res.status(200).json({ message: "User successfully verified" });
  }

  return res.status(400).json({ message: "Could not verify user" });
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`User with email ${email} does not exist`);
    return res.status(400).json({ message: language.forgotPasswordMessage });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: "User is not verified" });
  }

  //generating new password reset code & saving document
  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;
  await user.save();

  //send email
  await sendEmail({
    from: "commandTTT@gmail.com",
    to: user.email,
    text: `Password reset code: ${user.passwordResetCode}. Id: ${user.id}`,
  });
  logger.debug(`Password reset email sent to ${email}`);

  return res.status(200).json({ message: language.forgotPasswordMessage });
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordParams, {}, ResetPasswordInput>,
  res: Response
) => {
  const { id, passwordResetCode } = req.params;

  const { password } = req.body;

  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).json({ message: "Could not reset user password" });
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();

  return res.status(200).json({ message: "Successfully updated password" });
};
