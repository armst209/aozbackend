import { object, string, TypeOf } from "zod";
import userValidationRules from "../validation/user.validation";

const { name, email, username, password } = userValidationRules;

//user schema
export const createUserSchema = object({
  body: object({
    name: string({ invalid_type_error: "Name must be a string" })
      .trim()
      .min(name.minLength, "Name is too short - min length is 6 characters")
      .max(name.maxLength, "Name is too long - max length is 60 characters")
      .optional(),
    email: string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
      .trim()
      .min(email.minLength, "Email is too short - min length is 5 characters")
      .max(email.maxLength, "Email is too long - max length is 50 characters")
      .email("Please enter a valid email address"),
    username: string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
      .trim()
      .min(
        username.minLength,
        "Username is too short - min length is 5 characters"
      )
      .max(
        username.maxLength,
        "Username is too long - max length is 25 characters"
      ),
    password: string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
      .trim()
      .min(
        password.minLength,
        "Password is too short - min length is 6 characters"
      )
      .max(
        password.maxLength,
        "Password is too long - max length is 30 characters"
      ),
    passwordConfirmation: string({
      required_error: "Passwords do not match. Please re-enter your password",
      invalid_type_error: "Password must be a string",
    })
      .trim()
      .min(password.minLength, "Re-entered password is too short")
      .max(password.maxLength, "Re-entered password is too long"),
  }).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      console.log("Passwords do not match");
      ctx.addIssue({
        code: "custom",
        message: "Password do not match",
      });
    }
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid Email"),
  }),
});

//user inputs types
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
