  import { Link } from "react-router-dom";
import path from "../../constants/path";

  export default function ForgotPassword(){
      return(
        <div className="hold-transition login-page">
          <div className="login-box">
            <div className="login-logo">
              <b>Admin</b>NVNApp
            </div>
            {/* /.login-logo */}
            <div className="card">
              <div className="card-body login-card-body">
                <p className="login-box-msg">Nhập địa chỉ Email của bạn để nhận mật khẩu mới.</p>
                <form action="recover-password.html" method="post">
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email" />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-block">Nhận mật khẩu mới</button>
                    </div>
                    {/* /.col */}
                  </div>
                </form>
                <p className="mt-3 mb-1">
                  <Link to={path.login}>Đăng nhập</Link>
                </p>
                <p className="mb-0">
                  <Link to={path.register} className="text-center">Đăng ký tài khoản mới</Link>
                </p>
              </div>
              {/* /.login-card-body */}
            </div>
          </div>
        </div>
      )
  }