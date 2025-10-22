export type Role = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiAuthRegisterResponse {
  data: User;
  access_token: string;
  token_type: 'Bearer';
}

export interface ApiAuthLoginResponse {
  message: string;
  access_token: string;
  token_type: 'Bearer';
}

export interface ApiMeResponse {
  data: User | null;
}
