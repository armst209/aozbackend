import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Date } from "mongoose";

import { User } from "./user.model";

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
