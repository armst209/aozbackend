import mongoose, { ObjectId } from "mongoose";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";

export interface TestMailSMTP {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}

export interface JWTVerifyReturn {
  payload: any | null;
  expired: boolean;
}
