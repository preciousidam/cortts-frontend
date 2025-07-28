export interface LoginRes {
  access_token: string
  token_type: string
  role: 'admin' | 'agent' | 'client'
  user_id: string
}

export interface RegisterReq {
  password: string;
  email: string;
  fullname: string;
  phone: string;
}
export interface LoginReq {
  username: string;
  password: string;
}

export interface VerifyReq {
  email: string;
  code: string;
}

export interface ForgotPasswordReq {
  email: string;
}

export interface ResetPasswordReq {
  email: string;
  new_password: string;
  code: string;
}

export interface IResonse<T> {
  data: T;
  count: number;
}
export interface IErrorResponse {
  message: string;
  status_code: number;
  status: string;
}