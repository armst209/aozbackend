import { User, UserModel } from "../models/user.model";

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

export function findUserByUserName(username: string) {
  return UserModel.findOne({ username });
}
