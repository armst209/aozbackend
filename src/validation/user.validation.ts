import _ from "lodash";
import { nanoid } from "nanoid";

export default {
  name: {
    minLength: 5,
    maxLength: 60,
    default: () => `TTT Member #${nanoid(6)}`,
  },
  email: {
    required: true,
    lowercase: true,
    minLength: 5,
    maxLength: 60,
    unique: true,
  },
  username: {
    required: true,
    minLength: 5,
    maxLength: 25,
    unique: true,
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 30,
  },
  team: {
    required: true,
    minLength: 1,
    maxLength: 30,
    default: "Black Otter",
  },
  rank: {
    required: true,
    minLength: 1,
    maxLength: 30,
    default: "Ensign",
  },
  roles: {
    required: true,
    minLength: 1,
    maxLength: 2,
    default: ["user"],
  },
  isAdmin: {
    required: true,
    default: false,
  },

  canEdit: {
    required: true,
    default: false,
  },
};

export const userRoles = ["admin", "editor", "user"];
