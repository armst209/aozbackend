import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import { getModelForClass } from "@typegoose/typegoose";
import mobileSuitValidation from "../validation/mobilesuit.validation";

const {
  name,
  modelNumber,
  unitType,
  series,
  seriesNumber,
  manufacturer,
  description,
  pilots,
  developedFrom,
  developedInto,
  yearCreated,
  height,
  weight,
  armor,
  powerSource,
  powerOutput,
  armaments,
  specialEquipment,
  configurations,
  variants,
  operators,
} = mobileSuitValidation;

//options
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

//User schema definition
export class MobileSuit {
  @prop({
    required: name.required,
    minLength: name.minLength,
    maxLength: name.maxLength,
  })
  public name: string;
  @prop({
    required: name.required,
    minLength: modelNumber.minLength,
    maxLength: modelNumber.maxLength,
  })
  public modelNumber: string;

  @prop({
    required: unitType.required,
    minLength: unitType.minLength,
    maxLength: unitType.maxLength,
  })
  public unitType: string;
  @prop({
    required: series.required,
    minLength: series.minLength,
    maxLength: series.maxLength,
  })
  public series: string;
  @prop({
    required: seriesNumber.required,
    minLength: seriesNumber.minLength,
    maxLength: seriesNumber.maxLength,
  })
  public seriesNumber: number;
  @prop({
    required: manufacturer.required,
    minLength: manufacturer.minLength,
    maxLength: manufacturer.maxLength,
  })
  public manufacturer: string;
  @prop({
    required: description.required,
    minLength: description.minLength,
    maxLength: description.maxLength,
  })
  public description: string;
  @prop({
    required: pilots.required,
    default: pilots.default,
  })
  public pilots: string[];
  @prop({
    required: developedFrom.required,
    default: developedFrom.default,
  })
  public developedFrom: string[];
  @prop({
    required: developedInto.required,
    default: developedInto.default,
  })
  public developedInto: string[];
  @prop({
    required: yearCreated.required,
    minLength: yearCreated.minLength,
    maxLength: yearCreated.maxLength,
  })
  public yearCreated: number;

  @prop({
    required: operators.required,
    default: operators.default,
  })
  public operators: string[];

  @prop({
    required: height.required,
    minLength: height.minLength,
    maxLength: height.maxLength,
  })
  public height: number;
  @prop({
    required: weight.required,
    minLength: weight.minLength,
    maxLength: weight.maxLength,
  })
  public weight: number;

  @prop({
    required: powerSource.required,
    minLength: powerSource.minLength,
    maxLength: powerSource.maxLength,
  })
  public powerSource: string;

  @prop({
    required: powerOutput.required,
    minLength: powerOutput.minLength,
    maxLength: powerOutput.maxLength,
  })
  public powerOutput: string;
  @prop({
    required: armor.required,
    default: armor.default,
  })
  public armor: string[];
  @prop({
    required: armaments.required,
    default: armaments.default,
  })
  public armaments: string[];
  @prop({
    required: specialEquipment.required,
    default: specialEquipment.default,
  })
  public specialEquipment: string[];
  @prop({
    required: configurations.required,
    default: configurations.default,
  })
  public configurations: string[];
  @prop({
    required: variants.required,
    default: variants.default,
  })
  public variants: string[];
}

export const MobileSuitModel = getModelForClass(MobileSuit, {
  schemaOptions: { timestamps: true },
});
