
import http from '../utils/http'
import baseApi from './base.api'

const URL = 'categories'

const categoriesApi = {
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
  treeCategories(){
    return http.get(`${URL}/tree-categories`)
  },
  treeCategoriesForm(){
    return http.get(`${URL}/tree-categories-form`)
  },
  flatCategories(){
    return http.get(`${URL}/flat-categories`)
  },
  crawlCategories(){
    return http.get(`${URL}/crawl-categories`)
  }
}

export default categoriesApi
