import { User } from "../models/user.model";

export interface TestMailSMTP {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}
