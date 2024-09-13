import { createReducer, createAction } from '@reduxjs/toolkit'

interface AuthState {
    access_token: string
    refresh_token: string
    profile: any
    permission: string[]
}

const initalState: AuthState = {
    access_token: '',
    refresh_token: '',
    profile: null,
    permission: []
}

export const setAccessToken = createAction<string>('auth/addAccessToken')
export const setRefeshToken = createAction<string>('/auth/addRefeshToken')
export const setProfileUser = createAction<string>('/auth/profileUser')
export const deleteAccessToken = createAction('/auth/deleteAccessToken')
export const deleteRefeshToken = createAction('/auth/deleteRefeshToken')
export const deleteProfileUser = createAction('/auth/deleteProfileUser')
//profileUser
const authReducer = createReducer(initalState, (builder) => {
  builder
    .addCase(setAccessToken, (state, action) => {
      state.access_token = action.payload
    })
    .addCase(setRefeshToken, (state, action) => {
      state.refresh_token = action.payload
    })
    .addCase(setProfileUser, (state, action) => {
      state.profile = action.payload
    })
    .addCase(deleteAccessToken, (state) => {
      state.access_token = ''
    })
    .addCase(deleteRefeshToken, (state) => {
      state.refresh_token = ''
    })
    .addCase(deleteProfileUser, (state) => {
      state.profile = ''
    })
})

export default authReducer
