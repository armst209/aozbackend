import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
   body: object({
      name: string(),
      username: string({ required_error: "" }),
      email: string({ required_error: "" }),
      password: string({ required_error: "" }),
   }),
});
