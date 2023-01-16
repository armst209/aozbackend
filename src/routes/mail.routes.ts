import express, { Response, Request } from "express";
import {
  getAllMailChimpLists,
  getMyMailChimpList,
  runMailChimpHealthCheck,
} from "../controllers/mailer.controller";

const router = express.Router();

//ping health test
router.get("/mail/admin/healthcheck", (_, res: Response) =>
  runMailChimpHealthCheck(res)
);
router.get("/api/admin/mail/getAllLists", (_, res: Response) =>
  getAllMailChimpLists(res)
);

router.get("/api/admin/mail/getMyList", (_, res: Response) =>
  getMyMailChimpList(res)
);

export default router;
