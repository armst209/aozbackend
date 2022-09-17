import express from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  verifyUserByEmailHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import validateClientInput from "../validation/validateClient";

const router = express.Router();

router.get("/api/users", getAllUsersHandler);

router.post(
  "/api/users",
  validateClientInput(createUserSchema), //validating info from client against schema - Zod validation
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

export default router;
