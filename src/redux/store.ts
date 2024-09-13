import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'

// Tạo store từ configureStore của redux toolkit
export const store = configureStore({
  reducer: { auth: authReducer }
})


// ĐỊnh nghĩa kiểu dữ liệu khi sử dụng redux với typescript
// Lấy RootState và AppDispatch từ store của chúng ta
// Định nghĩa kiểu RootStateđại diện cho kiểu của toàn bộ store được lưu trữ trong Redux
// getState là 1 method của store, trả về store hiện tại của ứng dụng
// ReturnType<typeof store.getState> tự động suy ra kiểu trả về của hàm getState
// => RootState luôn đồng bộ với cấu trúc thực tế của state trong store
// => Định nghĩa kiểu dữ liệu cho toàn bộ trạng thái của ứng dụng, 
// giúp TypeScript kiểm tra và xác thực việc truy cập trạng thái
export type RootState = ReturnType<typeof store.getState>

// tạo 1 type mới tên là AppDispatch, đại diện cho kiểu của hàm dispatch trong Redux store
// => Định nghĩa kiểu cho hàm dispatch của Redux store, giúp đảm bảo rằng 
// các hành động gửi đi được kiểm tra kiểu dữ liệu đúng và chính xác
export type AppDispatch = typeof store.dispatch
