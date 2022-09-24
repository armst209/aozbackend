import { User } from "../models/user.model";

const setRoles = (
  user: User,
  roleToSwitchTo: string,
  usersCurrentRoles: string[]
): User => {
  switch (roleToSwitchTo) {
    case "admin":
      const oldUserRoles = usersCurrentRoles.filter((role) => role !== "user");
      usersCurrentRoles = [...oldUserRoles, roleToSwitchTo];
      user.isAdmin = true;
      return user;
    case "user":
      const oldAdminRoles = usersCurrentRoles
        .filter((role) => role !== "admin")
        .filter((role) => role !== "editor");
      usersCurrentRoles = [...oldAdminRoles, roleToSwitchTo];
      user.isAdmin = false;
      return user;

    case "editor":
      const oldUserAdminRoles = usersCurrentRoles.filter(
        (role) => role !== "user"
      );
      usersCurrentRoles = [...oldUserAdminRoles, roleToSwitchTo];
      return user;
    default:
      return user;
  }
};

export default setRoles;
