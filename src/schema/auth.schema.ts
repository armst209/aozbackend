import { object, string, TypeOf } from "zod";
import language from "../utils/language";
import userValidation from "../validation/user.validation";

export const createSessionSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      language.vagueLoginMessage
    ),
    password: string({ required_error: "Password is required" }).min(
      userValidation.password.minLength,
      language.vagueLoginMessage
    ),
  }),
});

export const getSessionsByUserEmailSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      language.validEmailMessage
    ),
  }),
});

export const endSessionSchema = object({
  body: object({
    token: string({ required_error: "Token is required" }),
  }),
});

export type GetByUserEmailSessionInput = TypeOf<
  typeof getSessionsByUserEmailSchema
>["body"];
export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
export type EndSessionInput = TypeOf<typeof endSessionSchema>["body"];
