import express from "express";
import {
  createSessionHandler,
  endSessionHandler,
  getAllSessionsHandler,
  getCurrentSessionHandler,
  getSessionsByUserEmail,
} from "../controllers/sessions.controller";
import authorizeUser from "../middleware/authorizeUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/sessions.schema";

const router = express.Router();

//public routes

//login
router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

//logout
router.delete("/api/session", endSessionHandler);

//admin routes
router.get("/api/admin/session", authorizeUser, getCurrentSessionHandler);
router.get("/api/admin/sessions", getAllSessionsHandler);
router.get("/api/admin/sessions", authorizeUser, getSessionsByUserEmail);

export default router;
