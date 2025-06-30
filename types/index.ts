export interface LoginRes {
  access_token: string
  token_type: string
  role: 'admin' | 'agent' | 'client'
  user_id: string
}