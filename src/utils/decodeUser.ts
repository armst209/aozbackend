import { Response } from "express";
import { verifyJWT } from "./jwt";
import { User } from "../models/user.model";

const decodeUser = (res: Response, accessToken: string, methodType: string) => {
  const decoded = verifyJWT(accessToken, "accessTokenPublicKey");

  let isRequestNotValid;
  if (!decoded) {
    isRequestNotValid = true;
    return isRequestNotValid;
  }

  if (decoded) {
    res.locals.user = decoded;
    const user: User = res.locals.user;
    const { isAdmin, roles, isVerified, canEdit } = user;

    const isGETAdminRequestNotAuthorized =
      isAdmin === false || !roles.includes("admin") || isVerified === false;

    const isPUTAdminRequestNotAuthorized =
      isAdmin === false ||
      !roles.includes("admin") ||
      isVerified === false ||
      canEdit === false;

    if (methodType === "GET") {
      isRequestNotValid = isGETAdminRequestNotAuthorized;
    }
    if (methodType === "PUT") {
      isRequestNotValid = isPUTAdminRequestNotAuthorized;
    }

    return isRequestNotValid;
  }
};

export default decodeUser;
