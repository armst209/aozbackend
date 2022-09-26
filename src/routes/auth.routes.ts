import express from "express";
import {
  createSessionHandler,
  endSessionHandler,
  getAllSessionsHandler,
  getSessionsByUserEmail,
} from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema, endSessionSchema } from "../schema/auth.schema";

const router = express.Router();

//private routes
router.get("/api/admin/sessions", getAllSessionsHandler);
router.get("/api/admin/sessions", getSessionsByUserEmail);

//public routes
router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.put(
  "/api/session",
  validateResource(endSessionSchema),
  endSessionHandler
);

export default router;
