import { Request } from "express";
export const PUBLIC_ROUTES: string[] = [
  "/api/session",
  "/api/mobilesuits",
  "/api/users/register",
  "/api/session/login",
  "/api/session/logout",
  "/api/users/verify",
  "/api/users/forgotpassword",
  "/api/users/resetpassword",
];
export const checkPublicRoutes = (req: Request): boolean => {
  return PUBLIC_ROUTES.includes(req.path);
};
