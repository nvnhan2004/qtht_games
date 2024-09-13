
import http from '../utils/http'
import { URL_REGISTER } from './auth.api'
import baseApi from './base.api'

const URL = 'dashboard'

const dashboardApi = {
  getChiSoTrongThang(id: any){
    return http.get(`${URL}/get-chi-so-trong-thang/${id}`);
  },
  thongKeCacLoaiChiTieuTheoThang(id: any, year: number){
    return http.get(`${URL}/thong-ke-cac-loai-chi-tieu-theo-thang/${id}/${year}`);
  },
  thongKeCacLoaiChiTieuTheoNam(id: any, so_nam: number){
    return http.get(`${URL}/thong-ke-cac-loai-chi-tieu-theo-nam/${id}/${so_nam}`);
  },
  thongKeCacLoaiThuNhapTheoThang(id: any, year: number){
    return http.get(`${URL}/thong-ke-cac-loai-thu-nhap-theo-thang/${id}/${year}`);
  },
  thongKeCacLoaiThuNhapTheoNam(id: any, so_nam: number){
    return http.get(`${URL}/thong-ke-cac-loai-thu-nhap-theo-nam/${id}/${so_nam}`);
  },
  thongKeThuChiTheoThang(id: any, year: number){
    return http.get(`${URL}/thong-ke-thu-chi-theo-thang/${id}/${year}`);
  },
  thongKeThuChiTheoNam(id: any, so_nam: number){
    return http.get(`${URL}/thong-ke-thu-chi-theo-nam/${id}/${so_nam}`);
  },
}

export default dashboardApi
