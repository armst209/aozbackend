import express from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  resetPasswordHandler,
  verifyUserByEmailHandler,
  updateUserRoleHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
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
  "/api/users",
  validateResource(createUserSchema), //validating info from client against schema - Zod validation
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserByEmailHandler
);

router.post(
  "/api/users/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  "/api/users/resetpassword/:id/:passwordResetCode",
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
