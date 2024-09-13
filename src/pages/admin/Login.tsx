import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../apis/auth.api";
import userApi from "../../apis/user.api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TextErrorMessage from "../../components/common/TextErrorMessage";
import path from "../../constants/path";
import { AppContext } from "../../contexts/app.context";
import { ErrorResponse } from "../../types/utils.type";
import { getRules } from "../../utils/rules";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { useSelector, useDispatch } from 'react-redux'
import { setAccessToken, setRefeshToken, deleteAccessToken, deleteRefeshToken, setProfileUser } from "../../redux/auth.reducer"
import { setPermissionUserToLS } from "../../utils/auth";


interface FormData{
  username: string
  password: string
}

export default function Login(){
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
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

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const onSubmit = handleSubmit(data => {
    loginMutation.mutate(data, {
      onSuccess: (res: any) => {
        console.log(res);
        
        // dispatch(setAccessToken(res.data.response.accessToken.token))
        // dispatch(setRefeshToken(res.data.response.refreshToken.token))
        // dispatch(setProfileUser(res.data.response.profileUser))
        setIsAuthenticated(true)
        setProfile(res.data.response.profileUser)
        navigate(path.home)
      },
      onError: (error: any) => {
        console.log(error);
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  }, (errors) => {
    console.log(errors);
  })
  
  const rules = getRules(getValues)

    return(
      <div className="hold-transition login-page">
        <div className="login-box" style={{width: '500px'}}>
          <div className="login-logo">
            <b>Admin</b>NVNApp
          </div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Đăng nhập để bắt đầu phiên làm việc</p>
              <form onSubmit={onSubmit} noValidate>
                <div className="input-group mb-3">
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
                <div className="input-group mb-3">
                  <Input 
                      className="form-control"
                      type="password"
                      register={register}
                      name="password"
                      placeholder="Mật khẩu"
                      rules={rules.password}
                    />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                    <TextErrorMessage message={errors.password?.message}/>
                </div>
                <div className="row">
                  <div className="col-7">
                    <div className="icheck-primary">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">
                        Nhớ tài khoản
                      </label>
                    </div>
                  </div>

                  <div className="col-5">
                    <Button type="submit" className="btn btn-primary btn-block" disabled={loginMutation.isPending}>Đăng nhập</Button>
                  </div>

                </div>
              </form>
              <div className="social-auth-links text-center mb-3">
                <p>- Hoặc -</p>
                <Link to="/#" className="btn btn-block btn-primary">
                  <i className="fab fa-facebook mr-2" /> Đăng nhập với Facebook
                </Link>
                <Link to="/#" className="btn btn-block btn-danger">
                  <i className="fab fa-google-plus mr-2" /> Đăng nhập với Google+
                </Link>
              </div>

              <p className="mb-1">
                <Link to={path.forgotPassword}>Bạn quên mật khẩu?</Link>
              </p>
              <p className="mb-0">
                <Link to={path.register} className="text-center">Đăng ký tài khoản mới</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    )
}