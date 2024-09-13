import { ProfileUser, User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = {
  response: Token
  statusCode: number
  message: string
  isSuccess: boolean
}
export type RegisterResponse = {
  status: string
  message: string
  isSuccess: boolean
}

export type Token = { 
  accessToken: DetaiToken,
  refreshToken: DetaiToken,
  profileUser: ProfileUser,
  permissionUser: string[]
}

type DetaiToken = {
  token: string,
  expiryTokenDate: Date
}
