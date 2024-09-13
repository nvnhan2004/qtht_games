import { AuthResponse, RegisterResponse } from '../types/auth.type'
import http from '../utils/http'

export const URL_LOGIN = 'Authentication/login'
export const URL_REGISTER = 'Authentication/Register'
export const URL_FORGOTPASSWORD = 'Authentication/ForgotPassword'
export const URL_LOGOUT = 'Authentication/logout'
export const URL_REFRESH_TOKEN = 'Authentication/RefreshToken'

const authApi = {
  registerAccount(body: { username: string; password: string }) {
    return http.post<RegisterResponse>(URL_REGISTER, body)
  },
  login(body: { username: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logout() {
    return http.post(URL_LOGOUT)
  }
}

export default authApi