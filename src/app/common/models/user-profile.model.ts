export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  avatar?: string;
  role?: any;
  sub?: string;
  scopes?: string;
  accessToken?: string;
  refreshToken?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}