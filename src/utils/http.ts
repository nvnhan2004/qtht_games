import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify';
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from '../apis/auth.api';
import HttpStatusCode from '../constants/httpStatusCode.enum';
import { AuthResponse } from '../types/auth.type';
import { ErrorResponse } from '../types/utils.type';
import {
    clearLS,
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setPermissionUserToLS,
    setProfileToLS,
    setRefreshTokenToLS
  } from './auth'
import { isAxiosUnauthorizedError } from './utils';

class Http{
    instance: AxiosInstance

    // lý do tạo biến accessToken thay vì gọi luôn hàm getAccessTokenFromLS()
    // dữ liệu localStorage được lưu trong ổ cứng thay vì ram nên tốc độ sẽ chậm hơn
    // việc gán thực hiện trong constructor (thực hiện 1 lần) nên ko ảnh hưởng đến hiệu xuất
    private accessToken: string
    private refreshToken: string
    private refreshTokenExpiry: Date
    private refreshTokenRequest: Promise<string> | null
    constructor(){
        this.accessToken = getAccessTokenFromLS()
        this.refreshToken = getRefreshTokenFromLS()
        this.refreshTokenExpiry = new Date()
        this.refreshTokenRequest = null
        this.instance = axios.create({
            baseURL: 'https://localhost:7196/api/',
            // timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                // 'expire-access-token': 60 * 60 * 24, // 1 ngày
                // 'expire-refresh-token': 60 * 60 * 24 * 160, // 160 ngày
            }
        })

        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.authorization = `Bearer ${this.accessToken}`
                    return config
                }
                return config
            },
            (error) => {
                debugger
                return Promise.reject(error)
            }
        )

        // Thêm một bộ đón chặn response
        this.instance.interceptors.response.use((response) => {
            // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
            // Làm gì đó với dữ liệu response
            const { url } = response.config
            if(url === URL_LOGIN) {
                const data = response.data as AuthResponse
                this.accessToken = data.response.accessToken.token
                this.refreshToken = data.response.refreshToken.token
                this.refreshTokenExpiry = data.response.refreshToken.expiryTokenDate
                setAccessTokenToLS(this.accessToken)
                setRefreshTokenToLS(this.refreshToken)
                setProfileToLS(data.response.profileUser)
                setPermissionUserToLS(data.response.permissionUser)
            }
            else if(url === URL_LOGOUT){
                this.accessToken = ''
                this.refreshToken = ''
                clearLS()
            }

            return response;
        }, (error: AxiosError) => {
            console.log(error);
            
            // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
            // Làm gì đó với lỗi response
            // Chỉ toast lỗi không phải 422 và 401
            if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)){
                const data: any | undefined = error.response?.data
                const message = data?.description || error.message
                toast.error(message)
            }

            // Lỗi Unauthorized (401) có rất nhiều trường hợp
            // - Token không đúng
            // - Không truyền token
            // - Token hết hạn*
    
            // Nếu là lỗi 401
            // giải thích hàm isAxiosUnauthorizedError
            // hàm nhận vào tham số error, có kiểu dữ liệu quy định là ErrorResponse
            // ErrorResponse có 2 thuộc tính: message và data
            // data có kiểu dữ liệu generic và ở đây data sẽ là { name: string; message: string }
            if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
                const config = error.response?.config || { headers: {}, url: '' }
                const { url } = config
                // Trường hợp Token hết hạn và request đó không phải là của request refresh token
                // thì chúng ta mới tiến hành gọi refresh token
                // if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
                if (url !== URL_REFRESH_TOKEN) {
                    // Hạn chế gọi n lần handleRefreshToken (khi có n api 401, vì khi api lỗi sẽ chạy vào đây)
                    this.refreshTokenRequest = this.refreshTokenRequest
                    ? this.refreshTokenRequest
                    : this.handleRefreshToken().finally(() => {
                        // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                        // setTimeout(() => {
                        //     this.refreshTokenRequest = null
                        // }, 10000)
                        
                        this.refreshTokenRequest = null
                    })
                    return this.refreshTokenRequest.then((access_token) => {
                        // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                        return this.instance({ ...config, headers: { ...config.headers, authorization: `Bearer ${access_token}` } })
                    })
                }
    
                // Còn những trường hợp như token không đúng
                // không truyền token,
                // token hết hạn nhưng gọi refresh token bị fail
                // thì tiến hành xóa local storage và toast message
        
                clearLS()
                this.accessToken = ''
                this.refreshToken = ''
                toast.error(error.response?.data.data?.message || error.response?.data.message || error.response?.data.description)
                // window.location.reload()
            }
            return Promise.reject(error);
        });
    }
    private handleRefreshToken() {
        return this.instance.post(URL_REFRESH_TOKEN, {
            accessToken: this.accessToken,
            refreshToken: {
                token: this.refreshToken,
                expiryTokenDate: this.refreshTokenExpiry
            }
        })
        .then((res: any) => {
            const access_token = res.data.response?.accessToken.token
            const refresh_token = res.data.response?.refreshToken.token
            setAccessTokenToLS(access_token)
            setRefreshTokenToLS(refresh_token)
            this.accessToken = access_token
            this.refreshToken = refresh_token
            return access_token
        })
        .catch((error) => {
            clearLS()
            this.accessToken = ''
            this.refreshToken = ''
            throw error
        })
    }
}

const http = new Http().instance

export default http