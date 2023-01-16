export interface TestMailSMTP {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}

export interface JWTVerifyReturn {
  payload: any | null;
  expired: boolean;
}

export enum UserRoles {
  User,
  Admin,
  Editor,
}
