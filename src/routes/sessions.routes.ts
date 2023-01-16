import express from "express";
import {
  createSessionHandler,
  endSessionHandler,
  getAllSessionsHandler,
  getCurrentSessionHandler,
  getSessionsByUserEmailHandler,
} from "../controllers/sessions.controller";

import validateResource from "../middleware/validateResource";
import { createUserSessionSchema } from "../schema/sessions.schema";

const router = express.Router();

//login
router.post(
  "/api/session/login",
  validateResource(createUserSessionSchema),
  createSessionHandler
);

//logout
router.delete("/api/session/logout", endSessionHandler);

//admin routes
router.get("/api/admin/session", getCurrentSessionHandler);
router.get("/api/admin/sessions", getAllSessionsHandler);
router.get("/api/admin/sessions/:email", getSessionsByUserEmailHandler);

export default router;
