// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dieuHuongApi from "../apis/dieuHuong.api";
import path from "../constants/path";
import { getPermissionFromLS } from "../utils/auth";
import { useLocation } from 'react-router-dom';

function SideNav() {
  const [menus, setMenus] = useState([])
  const permission = getPermissionFromLS()
  let location = useLocation();

  const getDieuHuongByUserMutation = useMutation({
    mutationFn: () => dieuHuongApi.treeDieuHuong()
  })
  
  useEffect(() => {
    getDieuHuongByUserMutation.mutate(undefined, {
      onSuccess: (dieuHuong) => {
        setMenus(dieuHuong.data)
      }
    })
  }, []);

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{minHeight: '100%'}}>
  {/* Brand Logo */}
  <Link to={path.home} className="brand-link">
    <img src="/logo-nvnapp.png" alt="AdminLTE Logo" className="brand-image img-circle" style={{opacity: '.8', marginTop: '-12px', maxHeight: '55px'}} />
    <span className="brand-text font-weight-light">NVNApp</span>
  </Link>
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
      </div>
      <div className="info">
        <a href="#" className="d-block">Nguyễn Văn Nhàn</a>
      </div>
    </div> */}
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {menus?.map((menu: any) => (
          <Fragment key={menu.value}>
            {permission?.includes(menu.ma) &&
            <Fragment>
              <li className="nav-header text-uppercase">{menu.label}</li>
              {menu.children.map((item: any) => (
                <Fragment key={item.value}>
                  {permission?.includes(item.ma) &&
                  <li className="nav-item">
                    <Link to={item.url === '/' ? '#' : item.url} className={location.pathname === item.url ? "nav-link active" : "nav-link"}>
                      <i className={item.icon}></i>
                      <p>
                        {item.label}
                        {item.children.length > 0 && <i className="fas fa-angle-left right" />}
                      </p>
                    </Link>
                    <ul className="nav nav-treeview">
                      {item.children.map((item2: any) => (
                      <Fragment key={item2.value}>
                      {permission?.includes(item2.ma) &&
                        <li className="nav-item">
                          <Link to={item2.url} className={location.pathname === item2.url ? "nav-link active" : "nav-link"}>
                            <i className={item2.icon} />
                            <p>{item2.label}</p>
                          </Link>
                        </li>
                        }
                      </Fragment>
                      ))}
                    </ul>
                  </li>
                  }
                </Fragment>
              ))}
            </Fragment>
            }
          </Fragment>
        ))}
        
        {/* <li className="nav-header">QUẢN TRỊ HỆ THỐNG</li>
        <li className="nav-item">
          <Link to={path.user} className="nav-link">
            <i className="nav-icon far fa-circle text-primary" />
            <p className="text">Người dùng</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={'/qtht-nhom-nguoi-dung'} className="nav-link">
            <i className="nav-icon far fa-circle text-warning" />
            <p>Nhóm người dùng</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={'/qtht-dieu-huong'} className="nav-link">
            <i className="nav-icon far fa-circle text-info" />
            <p>Điều hướng</p>
          </Link>
        </li> */}
      </ul>
    </nav>
  </div>
</aside>

    </div>
  );
}

export default SideNav;
