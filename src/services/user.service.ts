//services talk to database - operations to perform on database
import { UserModel, User } from "../models/user.model";
//Partial - selecting any properties from an interface

export function getAllUsers() {
  return UserModel.find();
}

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}
export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
