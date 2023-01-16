import express from "express";
import { createSessionHandler } from "../controllers/sessions.controller";
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  resetPasswordHandler,
  verifyUserByEmailHandler,
  updateUserRoleHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSessionSchema } from "../schema/sessions.schema";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserRoleSchema,
  verifyUserSchema,
} from "../schema/user.schema";

const router = express.Router();

//public routes
router.post(
  "/api/users/register",
  validateResource(createUserSchema), //validating info from client against schema - Zod validation
  createUserHandler
);

router.post(
  "/api/users/login",
  validateResource(createUserSessionSchema),
  createSessionHandler
);

router.post(
  "/api/users/verify",
  validateResource(verifyUserSchema),
  verifyUserByEmailHandler
);

router.post(
  "/api/users/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  "/api/users/resetpassword",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

//private routes
router.get("/api/admin/users", getAllUsersHandler);
router.put(
  "/api/admin/users",
  validateResource(updateUserRoleSchema),
  updateUserRoleHandler
);

export default router;
