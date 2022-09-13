import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string()
      .min(6, "Name is too short - min length is 6 characters")
      .max(60, "Name is too long - max length is 60 characters"),
    email: string({ required_error: "Email is required" })
      .min(5, "Email is too short - min length is 5 characters")
      .max(50, "Email is too long - max length is 50 characters"),
    username: string({ required_error: "Username is required" })
      .min(5, "Username is too short - min length is 5 characters")
      .max(25, "Username is too long - max length is 25 characters"),
    password: string({ required_error: "Password is required" })
      .min(6, "Password is too short - min length is 6 characters")
      .max(30, "Password is too long - max length is 30 characters"),

    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }).email("Please enter a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
