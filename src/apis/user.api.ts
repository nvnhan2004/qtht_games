
import http from '../utils/http'
import { URL_REGISTER } from './auth.api'
import baseApi from './base.api'

const URL = 'user'

const userApi = {
  getUsers(params: any) {
    // return setTimeout(() => http.get(URL), 3000)
    return baseApi.getMany(params, URL)
  },
  getUser(id: number | string) {
    return http.get(`${URL}/${id}`)
  },
  createAccount(body: any) {
    return http.post(URL_REGISTER, body)
  },
  updateUser(id: string, body: any) {
    return http.put(`${URL}/${id}`, body)
  },
  deleteUser(id: string) {
    return http.delete(`${URL}/${id}`)
  },
  deleteUsers(ids: string[]) {
    return http.post(`${URL}/deletes`, ids)
  },
  getPermissionUser(){
    return http.get(`${URL}/get-permission-user`)
  },
  getAllUser(){
    return http.get(`${URL}/get-all-nguoi-dung`)
  }
  
}

export default userApi
