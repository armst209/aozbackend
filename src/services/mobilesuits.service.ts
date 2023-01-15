import { MobileSuitModel } from "../models/mobilesuit.model";

export function getAllMobileSuits() {
  return MobileSuitModel.find();
}
