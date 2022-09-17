import { nanoid } from "nanoid";
import { boolean, object, string, TypeOf } from "zod";
import userValidationRules from "../validation/user.validation";
import logger from "../utils/logger";

const { name, email, username, password, rank, role, team, isAdmin } =
  userValidationRules;

//user schema
export const createUserSchema = object({
  body: object({
    name: string({ invalid_type_error: "Name must be a string" })
      .min(name.minLength, "Name is too short - min length is 6 characters")
      .max(name.maxLength, "Name is too long - max length is 60 characters")
      .default(name.default)
      .optional(),
    email: string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
      .min(email.minLength, "Email is too short - min length is 5 characters")
      .max(email.maxLength, "Email is too long - max length is 50 characters")
      .email("Please enter a valid email address"),
    username: string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
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
      .min(
        password.minLength,
        "Password is too short - min length is 6 characters"
      )
      .max(
        password.maxLength,
        "Password is too long - max length is 30 characters"
      ),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
      invalid_type_error: "Password must be a string",
    })
      .min(password.minLength, "Password confirmation is too short")
      .max(password.maxLength, "Password confirmation  is too long"),
    team: string({
      required_error: "Team is required",
      invalid_type_error: "Team must be a string",
    })
      .min(
        team.minLength,
        `Team is too short - min length is ${team.minLength} characters`
      )
      .max(
        team.maxLength,
        `Team is too long - max length is ${team.minLength} characters`
      )
      .default(team.default),
    rank: string({
      required_error: "Rank is required",
      invalid_type_error: "Rank must be a string",
    })
      .min(
        rank.minLength,
        `Rank is too short - min length is ${rank.minLength} characters`
      )
      .max(
        rank.maxLength,
        `Rank is too long - max length is ${rank.minLength} characters`
      )
      .default(rank.default),
    role: string({
      required_error: "Role is required",
      invalid_type_error: "Role must be a string",
    })
      .min(
        role.minLength,
        `Role is too short - min length is ${role.minLength} characters`
      )
      .max(
        role.maxLength,
        `Role is too long - max length is ${role.minLength} characters`
      )
      .default(role.default),
    isAdmin: boolean({
      required_error: "isAdmin is required",
      invalid_type_error: "isAdmin must be a boolean",
    }).default(isAdmin.default),
    verificationCode: string({
      required_error: "Verification code is required",
      invalid_type_error: "verificationCode must be a string",
    }).default(() => nanoid()),
    passwordResetCode: string().trim().nullable(),
    isVerified: boolean({
      invalid_type_error: "isVerified must be a boolean",
    }).optional(),
  }).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      logger.error("Passwords do not match");
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
