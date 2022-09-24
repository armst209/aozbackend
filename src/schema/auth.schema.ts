import { boolean, object, string, TypeOf } from "zod";
import language from "../utils/language";
import userValidation from "../validation/user.validation";

export const createSessionSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email or password"
    ),
    password: string({ required_error: "Password is required" }).min(
      userValidation.password.minLength,
      "Invalid email or password"
    ),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
