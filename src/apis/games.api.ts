
import http from '../utils/http'
import baseApi from './base.api'

const URL = 'games'

const gamesApi = {
  create(obj: any){
    return baseApi.create(obj, URL)
  },
  getMany(params: any) {
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
  crawlGames(obj: any){
    return http.post(`${URL}/crawl-games`, obj);
  }
}

export default gamesApi
