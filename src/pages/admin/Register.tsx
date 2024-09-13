import { useMutation } from "@tanstack/react-query";
import { omit } from "lodash";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../../apis/auth.api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TextErrorMessage from "../../components/common/TextErrorMessage"
import path from "../../constants/path";
import { AppContext } from "../../contexts/app.context";
import { ErrorResponse } from "../../types/utils.type";
import { getRules } from "../../utils/rules";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";

interface FormData{
  username: string
  email: string
  password: string
  confirm_password: string
  roles: any
}

export default function Register(){
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    // watch, // làm component bị re-render
    getValues, // dựa theo event nào đó: click, ... (ko làm re-render như watch, còn event vẫn có thể re-render)
    formState: {
      errors
    }
  } = useForm<FormData>() 
  // gán cho các biến register, errors có kiểu dữ liệu là FormData
  // nếu ko nó sẽ nhận kiểu mặc định là FieldValues, như thế errors sẽ ko sử dụng đc message

  const registerAccountMutation = useMutation({
    // lấy dữ liệu kiểu FormData nhưng dùng Omit để bỏ field confirm_password
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit(data => {
    // console.log(data)
    const body = omit(data, ['confirm_password'])
    body.roles = ['User']
    registerAccountMutation.mutate(body, {
      onSuccess: (res) => {
        if (res.data.isSuccess)
          navigate(path.home)
        toast.success(res.data.message)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  const rules = getRules(getValues)
  // console.log(rules);

  // const pass = watch() // theo dõi toàn bộ các field, mỗi khi change đều re-render component
  // const email = watch('email') // chỉ theo dõi field email, mỗi khi change email sẽ re-render component

  // khi nào component re-render lại (khi submit) thì console sõ log

    return(
      
      <div className="hold-transition login-page">
        <div className="register-box" style={{width: '500px'}}>
          <div>
            <div className="register-logo">
              <b>Admin</b>NVNApp
            </div>
            <div className="card">
              <div className="card-body register-card-body">
                <p className="login-box-msg">Đăng ký tài khoản mới</p>
                {/* noValidate: chặn toàn bộ validate trong form */}
                <form onSubmit={onSubmit} noValidate> 
                  {/* <div className="input-group mb-3">
                    <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Họ và tên" 
                    {...register('fullname')}/>
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div> */}

                  {/* export type UseFormRegisterReturn<TFieldName extends InternalFieldName = InternalFieldName> = {
                    onChange: ChangeHandler;
                    onBlur: ChangeHandler;
                    ref: RefCallBack;
                    name: TFieldName;
                    min?: string | number;
                    max?: string | number;
                    maxLength?: number;
                    minLength?: number;
                    pattern?: string;
                    required?: boolean;
                    disabled?: boolean;
                  }; 
                  
                  register trả về toàn bộ các thuộc tính trên, trong đó có name, nên ko cần field name ở input nữa
                  */}

                  <div className="input-group">
                    <Input 
                      className="form-control"
                      type="text"
                      register={register}
                      name="username"
                      placeholder="Tài khoản"
                      rules={rules.username}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope" />
                      </div>
                    </div>
                    <TextErrorMessage message={errors.username?.message}/>
                  </div>

                  <div className="input-group">
                    <Input 
                      className="form-control"
                      type="email"
                      register={register}
                      name="email"
                      placeholder="Email"
                      rules={rules.email}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope" />
                      </div>
                    </div>
                    <TextErrorMessage message={errors.email?.message}/>
                  </div>

                  <div className="input-group mt-2">
                    <Input 
                      className="form-control"
                      type="password"
                      register={register}
                      name="password"
                      placeholder="Mật khẩu"
                      rules={rules.password}
                      autoComplete='on'
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                    
                    <TextErrorMessage message={errors.password?.message}/>
                  </div>

                  <div className="input-group mt-2">
                    <Input 
                      className="form-control"
                      type="password"
                      register={register}
                      name="confirm_password"
                      placeholder="Nhập lại mật khẩu"
                      rules={rules.confirm_password}
                      autoComplete='on'
                    />
                    {/* {...register('confirm_password', {...rules.confirm_password, validate: val => val === getValues('password') || 'Nhập lại mật khẩu chưa đúng'})}  */}

                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                    <TextErrorMessage message={errors.confirm_password?.message}/>
                  </div>

                  <div className="row mt-3">
                    <div className="col-8">
                      <div className="icheck-primary">
                        {/* <input type="checkbox" id="agreeTerms" name="terms" defaultValue="agree" />
                        <label htmlFor="agreeTerms">
                          I agree to the <a href="#">terms</a>
                        </label> */}
                        <Link to={path.login} className="text-center">Bạn đã có tài khoản</Link>
                      </div>
                    </div>
                    <div className="col-4">
                      <Button type="submit" className="btn btn-primary btn-block" disabled={registerAccountMutation.isPending}>Đăng ký</Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
}