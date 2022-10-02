import {
  getModelForClass,
  prop,
  Ref,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { Date } from "mongoose";

import { User } from "./user.model";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Session {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: true })
  isSessionValid: boolean;

  @prop({ default: null })
  sessionEndedAt: Date | null;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
