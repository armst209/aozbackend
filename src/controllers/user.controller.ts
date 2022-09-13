import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
   CreateUserInput,
   ForgotPasswordInput,
   VerifyUserInput,
} from "../schema/user.schema";
import {
   createUser,
   findUserByEmail,
   findUserById,
} from "../services/user.service";
import logger from "../utils/logger";
import { sendEmail } from "../utils/mailer";

//remember body is the 3rd input for the type

/**
 * @desc creates a new user and sends verification email to user
 * @param req
 * @param res
 * @returns 200 status if user has been successfully created
 */
export const createUserHandler = async (
   req: Request<{}, {}, CreateUserInput>,
   res: Response,
) => {
   const body = req.body;

   try {
      const user = await createUser(body);
      await sendEmail({
         from: process.env.MY_EMAIL,
         to: user.email,
         subject: "Please verify your account",
         text: `Verification code ${user.verificationCode}. Id:${user.id}`,
      });

      //not checking for if the user exists because of the unique constraint on the model
      return res.status(200).send("User successfully created");
   } catch (error: any) {
      //code for a unique constraint has been violated
      if (error.code === 11000) {
         res.status(409).send("Account already exists"); //conflict
      }
      return res.status(500).send(error);
   }
};

/**
 * @desc verifies user by checking isVerified and verificationCode
 * @param req
 * @param res
 * @returns 200 status if user is verified, 404 if user is not found, 400 if user cannot be verified
 */
export const verifyUserHandler = async (
   req: Request<VerifyUserInput>,
   res: Response,
) => {
   const id = req.params.id;
   const verificationCode = req.params.verificationCode;

   //finding user by id
   const user = await findUserById(id);
   if (!user) {
      res.sendStatus(404).send("User not found. Could not verify user");
   }

   //checking to see if user is already verified
   if (user?.isVerified) {
      return res.send("User is already verified");
   }

   //checking if verification code matches
   if (user?.verificationCode === verificationCode) {
      user.isVerified = true;
      //saving in document
      await user.save();
      return res.sendStatus(200).send("User successfully verified");
   }

   return res.sendStatus(400).send("Could not verify user");
};

export const forgotPasswordHandler = async (
   req: Request<{}, {}, ForgotPasswordInput>,
   res: Response,
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
   user.passwordConfirmation = passwordResetCode;
   await user.save();

   //sending email
   await sendEmail({
      to: user.email,
      from: "armst209dev@gmail.com",
      subject: "Reset your password",
      text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
   });

   logger.debug(`Password reset email sent to ${email}`);

   return res.sendStatus(200).send(message);
};

// const jwt = require("jsonwebtoken");

// const asyncHandler = require("express-async-handler");
// const User = require("../models/userModel");

// /**
//  * @description Register new user
//  * @route POST /api/users
//  * @access Public
//  */
// const registerUser = asyncHandler(async (req, res) => {
//    const { name, email, password, username, role, rank } = req.body;
//    if (!email || !password || !username) {
//       res.status(400);
//       throw new Error("Please add all fields");
//    }

//    //Check if user's email or username already exists
//    const emailExists = await User.findOne({ email });
//    const userNameExists = await User.findOne({ username });

//    if (emailExists || userNameExists) {
//       res.status(400);
//       throw new Error("User already exists");
//    }

//    //Hash & Salt password
//    const salt = await bcrypt.genSalt(15);
//    const hashedPassword = await bcrypt.hash(password, salt);
//    const roleType = role === "admin" ? role : "user";
//    const hasAdminCredentials = roleType === "admin" ? true : false;
//    const isCaptain = role === "admin" ? "Captain" : "Ensign";

//    //creating new user
//    const newUser = await User.create({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//       role: roleType,
//       rank: isCaptain,
//       isAdmin: hasAdminCredentials,
//    });

//    //checking if user data is valid
//    if (newUser) {
//       res.status(201).json({
//          _id: newUser.id,
//          name: newUser.name,
//          email: newUser.email,
//          username: newUser.username,
//          team: newUser.team,
//          rank: newUser.rank,
//          isAdmin: newUser.isAdmin,
//          token: generateToken(newUser._id),
//       });
//    } else {
//       res.status(400);
//       throw new Error("Invalid user data");
//    }
//    res.json({ message: `User has been registered` });
// });

// /**
//  * @description Authenticate a user
//  * @route POST /api/users/login
//  * @access Public
//  */
// const loginUser = asyncHandler(async (req, res) => {
//    const { email, password } = req.body;

//    if (!email || !password) {
//       res.status(400);
//       throw new Error("Please enter an email and password");
//    }
//    //Check for user email
//    const user = await User.findOne({ email });

//    if (!user) {
//       res.status(400);
//       throw new Error("User not found");
//    }

//    //comparing password from req.boy and hashed password for a match
//    if (user && (await bcrypt.compare(password, user.password))) {
//       res.status(200).json({
//          _id: user.id,
//          name: user.name,
//          email: user.email,
//          username: user.username,
//          role: user.role,
//          isAdmin: user.isAdmin,
//          token: generateToken(user._id),
//       });
//    } else {
//       res.status(400);
//       throw new Error("Invalid credentials");
//    }
// });

// /**
//  * @description Deletes a user by id
//  * @route DELETE /api/users/:id
//  * @access Private
//  */
// const deleteUser = asyncHandler(async (req, res) => {
//    const userToDelete = await User.findByIdAndDelete(req.user.id);
//    if (!userToDelete) {
//       res.status(401);
//       throw new Error("User not authorized");
//    }

//    res.status(200).json({
//       message: `User has been deleted`,
//    });
// });

// /**
//  * @description Updates current logged in user's information
//  * @route PUT /api/users/update-user
//  * @access Private
//  */
// const updateUser = asyncHandler(async (req, res) => {
//    const userToUpdate = User.findById(req.user.id);

//    if (!userToUpdate) {
//       res.status(401);
//       throw new Error("User not authorized");
//    }

//    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
//       new: true,
//    });

//    res.status(200).json(updatedUser);
// });
// /**
//  * @description Gets current logged in user
//  * @route GET /api/users/current-user
//  * @access Private
//  */
// const getCurrentUser = asyncHandler(async (req, res) => {
//    const { _id, name, email, isAdmin } = await User.findById(req.user.id);
//    res.status(200).json({ id: _id, name, email, isAdmin });
// });

// /**
//  * @description Gets all users
//  * @route GET /api/users
//  * @access Public
//  */
// const getAllUsers = asyncHandler(async (req, res) => {
//    const users = await User.find();
//    if (users.length === 0) {
//       res.send("No available users");
//    }
//    res.json(users);
// });

// /**
//  * @description Gets a user by email
//  * @route GET /api/users/email
//  * @access Public
//  */
// const getUserByEmail = asyncHandler(async (req, res) => {
//    const { email } = req.body;
//    const userByEmail = await User.findOne({ email });
//    if (!userByEmail) {
//       res.status(400);
//       throw new Error("User not found");
//    }
//    res.status(200).json(userByEmail);
// });

// /**
//  * @description Gets a user by id
//  * @route GET /api/users/:id
//  * @access Public
//  */
// const getUserById = asyncHandler(async (req, res) => {
//    const userById = await User.findById(req.params.id);
//    if (!userById) {
//       res.status(400);
//       throw new Error("User not found");
//    }
//    res.status(200).json(userById);
// });

// /**
//  * Generates JSON Web Token
//  * @param {*} id
//  * @returns token
//  */
// const generateToken = (id) => {
//    return jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//    });
// };
// module.exports = {
//    getAllUsers,
//    getUserById,
//    getUserByEmail,
//    getCurrentUser,
//    registerUser,
//    loginUser,
//    deleteUser,
//    updateUser,
// };
