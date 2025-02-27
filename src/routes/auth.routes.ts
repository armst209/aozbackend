import express from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

//public routes
router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default router;
