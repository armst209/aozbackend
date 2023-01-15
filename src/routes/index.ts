import express, { Response } from "express";
import user from "./user.routes";
import sessions from "./sessions.routes";
import mail from "./mail.routes";
import mobileSuits from "./mobilesuit.routes";

const router = express.Router();

router.get("/api/admin/healthcheck", (_, res: Response) => res.sendStatus(200));

router.use(sessions);
router.use(mail);
router.use(user);
router.use(mobileSuits);

export default router;
