import express, { Response } from "express";
import {
  getAllMailChimpLists,
  getMyMailChimpList,
  runMailChimpHealthCheck,
} from "../controllers/mailer.controller";

const router = express.Router();

//ping health test
router.get("/mail/healthcheck", (_, res: Response) =>
  runMailChimpHealthCheck(res)
);
router.get("/api/mail/getAllLists", (_, res: Response) =>
  getAllMailChimpLists(res)
);

router.get("/api/mail/getMyList", (_, res: Response) =>
  getMyMailChimpList(res)
);

export default router;
