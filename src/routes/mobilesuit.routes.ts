import express, { Response } from "express";
import { getAllMobileSuitsHandler } from "../controllers/mobilesuit.controller";
const router = express.Router();

router.get("/api/mobilesuits", (_, res: Response) =>
  getAllMobileSuitsHandler(res)
);

export default router;
