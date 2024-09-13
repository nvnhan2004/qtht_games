import axios, { AxiosError } from 'axios'
import HttpStatusCode from '../constants/httpStatusCode.enum'
import { ErrorResponse } from '../types/utils.type'
import { format, parseISO } from 'date-fns';

// isAxiosUnprocessableEntityError là một hàm TypeScript sử dụng để xác định liệu một đối tượng lỗi có phải là một lỗi 422 hay không
// <FormError> là một tham số kiểu (generic type parameter) cho hàm, cho phép chỉ định loại dữ liệu cho lỗi Axios (được truyền vào sau khi hàm được gọi)
// error: unknown - chưa xác định được lỗi gì
// error is AxiosError<FormError> là một "type predicate", cho biết hàm này trả về giá trị kiểu boolean và nếu giá trị đó là true, TypeScript sẽ hiểu rằng error có kiểu AxiosError<FormError>
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
    // sau khi chạy xong hàm isAxiosError(error) thì error đã có type nhất định rồi nên sẽ dùng đc error.response?.status
    return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

// hàm isAxiosError kiểm tra xem error có phải là lỗi Axios không, chuyển error: unknown -> AxiosError<T>
// error is AxiosError<T> muốn error biến thành type nhất định (AxiosError<T>) sau khi hàm chạy xong
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    // eslint-disable-next-line import/no-named-as-default-member
    return axios.isAxiosError(error)
}

// => Tổng kết: hàm isAxiosUnprocessableEntityError check xem lỗi bất kỳ truyền vào có phải lỗi 422 hay không




export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export const flattenTree = (dataMap: any, map = new Map()) => {
  dataMap.forEach((item: any) => {
      map.set(item.value, item);
      if (item.children && item.children.length > 0) {
          flattenTree(item.children, map);
      }
  });
  return { dataMap, map };
};

export const setValue = (value: any, map: any, mode: any,checked: any) => {
  if (['radioSelect', 'simpleSelect'].includes(mode)) {
      let item = map.get(value);
      if (item) {
        
        item.checked = checked;
      }

  } else {
      (value || []).forEach((key: any) => {
          let item = map.get(key);
          
          if (item) {
              item.checked = checked;
              item.expanded = checked;
          }
      });
  }
   
};

// Date
export function formatDate(value: any, type: any) {
  if (value) {
    let result = '';
    try {
      if (typeof value == 'string') {
        result = format(parseISO(value.replace('Z', '')), type ? type : 'dd/MM/yyyy HH:mm');
      } else {
        result = format(value, type ? type : 'dd/MM/yyyy HH:mm');
      }
    } catch (e) { }
    return result;
  } else {
      return '';
  }
}

export function formatMoneyShow(value: any, radix: string | undefined) {
  return value.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, radix)
}