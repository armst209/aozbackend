import express from "express";
import {
   createUserHandler,
   forgotPasswordHandler,
   verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import {
   createUserSchema,
   forgotPasswordSchema,
   verifyUserSchema,
} from "../schema/user.schema";
import validateClientInput from "../validation/validateClient";

const router = express.Router();

router.post(
   "/api/users",
   validateClientInput(createUserSchema), //validating info from client against schema - Zod validation
   createUserHandler,
);

router.post(
   "/api/users/verify/:id/:verificationCode",
   validateResource(verifyUserSchema),
   verifyUserHandler,
);

router.post(
   "/api/users/forgotpassword",
   validateResource(forgotPasswordSchema),
   forgotPasswordHandler,
);

export default router;
