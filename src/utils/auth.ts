import { ProfileUser } from "../types/user.type"

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const getPermissionFromLS = () => {
    const result = localStorage.getItem('permission')
    return result ? result.split(',') : null
}

export const setAccessTokenToLS = (access_token: string) => localStorage.setItem('access_token', access_token)

export const setRefreshTokenToLS = (refresh_token: string) => localStorage.setItem('refresh_token', refresh_token)

export const setPermissionUserToLS = (permission: any) => localStorage.setItem('permission', permission ? permission.join(',') : '')
  
export const setProfileToLS = (profile: ProfileUser) => {
    localStorage.setItem('profile', JSON.stringify(profile))
}

export const clearLS = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
    // const clearLSEvent = new Event('clearLS')
    // LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}