
import http from '../utils/http'
import { URL_REGISTER } from './auth.api'
import baseApi from './base.api'

const URL = 'qtht-dieu-huong'

const dieuHuongApi = {
  create(obj: any){
    return baseApi.create(obj, URL)
  },
  getMany(params: any) {
    // return setTimeout(() => http.get(URL), 3000)
    return baseApi.getMany(params, URL)
  },
  getById(id: string) {
    return baseApi.getById(id, URL)
  },
  update(obj: any, id: string) {
    return baseApi.update(obj, id, URL)
  },
  del(id: string) {
    return baseApi.del(id, URL)
  },
  deletes(ids: string[]) {
    return baseApi.deletes(ids, URL)
  },
  treeDieuHuong(){
    return http.get(`${URL}/tree-dieu-huong`)
  },
  treeDieuHuongForm(){
    return http.get(`${URL}/tree-dieu-huong-form`)
  },
  flatDieuHuong(){
    return http.get(`${URL}/flat-dieu-huong`)
  }
}

export default dieuHuongApi
