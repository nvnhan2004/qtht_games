// mượn kiểu dữ liệu RegisterOptions của 'react-hook-form' để định nghĩa rules (tạo gợi ý, tránh sai sót)
import type { 
    // RegisterOptions, 
    UseFormGetValues 
} from 'react-hook-form'

// type Rules = {[key in 'email' | 'password' | 'confirm_password']? : RegisterOptions}

// fn getRules nhận tham số truyền vào là 1 fn getValues, kiểu dữ liệu trả về là Rules
// fn getValues có thể truyền hoặc không, có kiểu dữ liệu là UseFormGetValues<any>
export const getRules = (getValues? : UseFormGetValues<any>) => ({
    email: {
        // required: {
        //     value: true,
        //     message: 'Email là bắt buộc'
        // },
        pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Email không đúng định dạng'
        },
        maxLength: {
          value: 160,
          message: 'Độ dài từ 5 - 160 ký tự'
        },
        minLength: {
          value: 5,
          message: 'Độ dài từ 5 - 160 ký tự'
        }
    },
    username: {
        required: {
            value: true,
            message: 'Tài khoản là bắt buộc'
        },
        maxLength: {
          value: 160,
          message: 'Độ dài từ 5 - 160 ký tự'
        },
        minLength: {
          value: 5,
          message: 'Độ dài từ 5 - 160 ký tự'
        }
    },
    password: {
        required: {
            value: true,
            message: 'Mật khẩu là bắt buộc'
        },
        // pattern: {
        //     value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
        //     message: 'Mật khẩu chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt'
        // },
        maxLength: {
          value: 160,
          message: 'Độ dài từ 6 - 160 ký tự'
        },
    },
    confirm_password: {
        required: {
            value: true,
            message: 'Nhập lại mật khẩu là bắt buộc'
        },
        validate:
            typeof getValues === 'function' // nếu getValues được truyền vào là 1 fn
            ? (value: any) => value === getValues('password') || 'Nhập lại password không khớp'
            : undefined
    },
    phonenumber: {
        pattern: {
            value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
            message: 'Số điện thoại không đúng định dạng'
        }
    },
    dmChiTieu_ma: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dmChiTieu_ten: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dmChiTieu_mo_ta: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dmThuNhap_ma: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dmThuNhap_ten: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dmThuNhap_mo_ta: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    nhomNguoiDung_ma: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    nhomNguoiDung_ten: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    nhomNguoiDung_mota: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dieuHuong_ma: {
        required: {
            value: true,
            message: 'Mã là bắt buộc'
        },
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dieuHuong_ten: {
        required: {
            value: true,
            message: 'Tên là bắt buộc'
        },
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dieuHuong_mo_ta: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    dieuHuong_duong_dan: {
        required: {
            value: true,
            message: 'Đường dẫn là bắt buộc'
        },
        maxLength: {
            value: 255,
            message: 'Độ dài tối đa 255 ký tự'
        }
    },
    dieuHuong_icon: {
        maxLength: {
            value: 255,
            message: 'Độ dài tối đa 255 ký tự'
        }
    },
    dieuHuong_so_thu_tu: {
        pattern: {
            value: /([0-9])\b/,
            message: 'Số thứ tự không đúng định dạng'
        }
    },
    categories_ten: {
        required: {
            value: true,
            message: 'Tên là bắt buộc'
        },
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    categories_mo_ta: {
        minLength: {
            value: 2,
            message: 'Độ dài từ 2 ký tự'
        }
    },
    categories_so_thu_tu: {
        pattern: {
            value: /([0-9])\b/,
            message: 'Số thứ tự không đúng định dạng'
        }
    },
    categories_img: {
        maxLength: {
            value: 1024,
            message: 'Độ dài tối đa 1024 ký tự'
        }
    },
    categories_title: {
        maxLength: {
            value: 1024,
            message: 'Độ dài tối đa 1024 ký tự'
        }
    },
    categories_description: {
        maxLength: {
            value: 1024,
            message: 'Độ dài tối đa 4096 ký tự'
        }
    },
    games_ten: {
        required: {
            value: true,
            message: 'Tên là bắt buộc'
        },
        maxLength: {
            value: 512,
            message: 'Độ dài tối đa 512 ký tự'
        }
    },
    games_mo_ta: {
        
    },
    games_iframe: {
        maxLength: {
            value: 2048,
            message: 'Độ dài tối đa 2048 ký tự'
        }
    },
    games_title: {
        maxLength: {
            value: 1024,
            message: 'Độ dài tối đa 1024 ký tự'
        }
    },
    games_description: {
        maxLength: {
            value: 1024,
            message: 'Độ dài tối đa 4096 ký tự'
        }
    },
})