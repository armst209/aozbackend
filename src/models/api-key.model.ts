import { getModelForClass, prop, Ref } from "@typegoose/typegoose";

export class APIKey {
  @prop({ required: true })
  key: string;
}
