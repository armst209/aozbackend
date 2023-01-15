import { object, string, TypeOf } from "zod";
import language from "../common/language";
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
  params: object({
    email: string({ required_error: "Email is required" }).email(
      language.validEmailMessage
    ),
  }),
});

export const getCurrentSessionSchema = object({
  request: object({
    tttATkn: string({ required_error: "Token is required" }),
  }),
});

export type GetByUserEmailSessionInput = TypeOf<
  typeof getSessionsByUserEmailSchema
>["params"];
export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
