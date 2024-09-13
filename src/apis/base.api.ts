import http from "../utils/http";

const baseApi = {
    getMany(props: any, url: string) {
        const { page, page_size, sort, filter, search } = props;
        const params = Object.assign({}, {
            page: page,
            page_size: page_size,
            sort: JSON.stringify(sort),
            filter: JSON.stringify(filter),
            search:search
        });
        if(url){
            return http.get(url, { params: params });
        }
        return http.get(`${url}`, { params: params });
    },
    getById(id: string, url: string) {
        if(url){
            return http.get(`${url}/${id}`);
        }
        return http.get(`${url}/${id}`);
    },
    create(obj: any, url: string) {
        if(url){
            return http.post(`${url}`, obj);
        }
        return http.post(`${url}`, obj);
    },
    update(obj: any, id: string, url: string) {
        if(url){
            return http.put(`${url}/${id}`, obj);
        }
        return http.put(`${url}/${id}`, obj);
    },
    del(id: string, url: string) {
        if(url){
            return http.delete(`${url}/${id}`);
        }
        return http.delete(`${url}/${id}`);
    },
    deletes(listId: string[], url: string) {
        return http.post(url + '/deletes', listId);
    },
    dels(url: string, listId = [], id: string) {
        return http.post(`${url}/${id}`, listId);
    },
    getDSDonVi(filter: any){
        filter = filter || {};
        const params = Object.assign({}, {
            page: 1,
            page_size: 0,
            sort: JSON.stringify({ten:1}),
            filter: JSON.stringify(filter),
            search:''
        });
        return http.get('api/qtht-don-vi', { params: params });
    }
}

export default baseApi;