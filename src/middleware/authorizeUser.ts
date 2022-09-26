import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import logger from "../utils/logger";
import decodeUser from "../utils/decodeUser";

//admin token
//eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzJlMzBlYmFmYzVjNGIxYjYzMTRkOTkiLCJuYW1lIjoiQWFyb24gQXJtc3Ryb25nIiwiZW1haWwiOiJhcm1zdDIwOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImFybXN0MjA5IiwidGVhbSI6IkJsYWNrIE90dGVyIiwicmFuayI6IkVuc2lnbiIsInJvbGUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsInVwZGF0ZWRBdCI6IjIwMjItMDktMjRUMDI6NDQ6NTEuOTQ3WiIsImlhdCI6MTY2NDAyNTI0MH0.bv_Y0oxVeGu-xDO6KRk3CweNrZkpqvfEUKSRWKdXQbqVFjk1ZW3aExlBCTZVHpDY1xtOJs_x9kHjW6min4lZNyzOf05CfuA-Thc63Lrve--OwFlNL8x67MZdae70BUB9nQQ4U_b1dqtqDWL3-NHl0H9SASSYgA_tizNcHydrlEA

//user token
//eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzJmMDNlMzYyZjFjM2Q4Y2NjYTQ5MDAiLCJuYW1lIjoiQWFyb24gUmVndWxhciBVc2VyIiwiZW1haWwiOiJhcm1zdDIwOXVzZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhcm1zdDIwOXVzZXIiLCJ0ZWFtIjoiQmxhY2sgT3R0ZXIiLCJyYW5rIjoiRW5zaWduIiwicm9sZSI6InVzZXIiLCJpc0FkbWluIjpmYWxzZSwidXBkYXRlZEF0IjoiMjAyMi0wOS0yNFQxMzoyNjo0MC45ODRaIiwiaWF0IjoxNjY0MDI2MDA5fQ.MJozsZ3tbW0Og_toJSry0rTttXO1QLmFVO2OOjfxiWmYzNkrYTYlVbSya5HfwHCpun0Fsdho8N2s8i4TOMFggfJprNcSaTiNGQtCh3hkcfNPN5avj6dFU5bApS8jPmLeNX9ecEn4rrGlXn59jvb7lUekz4aQ1OrQ9DgT8qi8

const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );

  //switch for statement for route auth
  switch (req.url) {
    //admin
    case "/api/admin/users":
    case "/api/admin/users/currentUser":
    case "/api/admin/sessions":
      if (!accessToken) {
        return res.status(401).send("User not authorized");
      }
      const isRequestNotValid = decodeUser(res, accessToken, req.method);

      if (isRequestNotValid) {
        return res.status(401).send("User not authorized");
      }
      return next();

    //all other routes
    default:
      return next();
  }
};
export default authorizeUser;
