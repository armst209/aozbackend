import {
  prop,
  getModelForClass,
  pre,
  modelOptions,
  Severity,
  DocumentType,
} from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import config from "config";
import logger from "../utils/logger";
import _ from "lodash";

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
    required: false,
    minLength: 5,
    maxLength: 60,
    default: () => `TTT Member #${_.random(5, 20000)}`,
  })
  public name: string;

  @prop({
    required: true,
    lowercase: true,
    minLength: 5,
    maxLength: 50,
    unique: true,
  })
  public email: string;

  @prop({
    required: true,
    minLength: 5,
    maxLength: 25,
    unique: true,
  })
  public username: string;

  @prop({ required: true, minLength: 6, maxLength: 30 })
  public password: string;

  @prop({
    required: true,
    minLength: 1,
    maxLength: 30,
    default: "Black Otter",
  })
  public team: string;

  @prop({
    required: true,
    minLength: 1,
    maxLength: 30,
    default: "Ensign",
  })
  public rank: string;

  @prop({ required: true, minLength: 1, maxLength: 20 })
  public role: string;

  @prop({ required: true, default: false })
  public isAdmin: boolean;

  @prop({ required: true, default: () => _.random(5, 50000) })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(
    this: DocumentType<User>,
    candidatePassword: string
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
