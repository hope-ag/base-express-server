export interface User {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  meta?: UserMeta;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserMeta {
  refreshToken: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
}

export type UserRole = 'admin' | 'user';

export const UserRoles = ['admin', 'user'];

export type UserFields = keyof User;
