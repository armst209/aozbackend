import {
   prop,
   getModelForClass,
   pre,
   modelOptions,
   Severity,
   DocumentType,
   index,
} from "@typegoose/typegoose";
import userValidationRules from "../validation/user.validation";
import bcrypt from "bcryptjs";
import config from "config";
import logger from "../utils/logger";
import _ from "lodash";
import { nanoid } from "nanoid";
const { name, email, username, password, team, rank, role, isAdmin } =
   userValidationRules;

//pre hook middleware
@pre<User>("save", async function (next) {
   if (!this.isModified("password")) {
      return next();
   } else {
      //Hash & Salt password
      const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
      const hash = await bcrypt.hashSync(this.password, salt);

      this.password = hash;

      return next();
   }
})
//adding index
@index({ email: 1 })
//options
@modelOptions({
   schemaOptions: {
      timestamps: true,
   },
   options: {
      allowMixed: Severity.ALLOW, //
   },
})

//User schema definition
export class User {
   @prop({
      minLength: name.minLength,
      maxLength: name.maxLength,
      default: name.default,
   })
   public name: string;

   @prop({
      required: email.required,
      lowercase: email.lowercase,
      minLength: email.minLength,
      maxLength: email.maxLength,
      unique: email.unique,
   })
   public email: string;

   @prop({
      required: username.required,
      minLength: username.minLength,
      maxLength: username.maxLength,
      unique: username.unique,
   })
   public username: string;

   @prop({
      required: password.required,
      minLength: password.minLength,
      maxLength: password.maxLength,
   })
   public password: string;

   @prop({
      required: password.required,
      minLength: password.minLength,
      maxLength: password.maxLength,
   })
   public passwordConfirmation: string;

   @prop({
      required: team.required,
      minLength: team.minLength,
      maxLength: team.maxLength,
      default: team.default,
   })
   public team: string;

   @prop({
      required: rank.required,
      minLength: rank.minLength,
      maxLength: rank.maxLength,
      default: rank.default,
   })
   public rank: string;

   @prop({
      required: role.required,
      minLength: role.minLength,
      maxLength: role.maxLength,
      default: role.default,
   })
   public role: string;

   @prop({ required: isAdmin.required, default: isAdmin.default })
   public isAdmin: boolean;

   @prop({ required: true, default: () => nanoid() })
   verificationCode: string;

   @prop()
   passwordResetCode: string | null;

   @prop({ default: false })
   isVerified: boolean;

   /**
    * @desc compares password from client and hashed password in database
    * @param this
    * @param candidatePassword
    * @returns true if passwords match, false if no match
    */
   async validatePassword(
      this: DocumentType<User>,
      candidatePassword: string,
   ): Promise<boolean> {
      try {
         return await bcrypt.compare(candidatePassword, this.password);
      } catch (error) {
         logger.error(error, "Could not validate password");
         return false;
      }
   }
}

//exporting model
export const UserModel = getModelForClass(User, {
   schemaOptions: { timestamps: true },
});
