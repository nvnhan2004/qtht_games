import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { useRoutes, Outlet, Navigate } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import { useContext, lazy, Suspense } from 'react'
import path from './constants/path'


const Login = lazy(() => import('./pages/admin/Login'))
const Register = lazy(() => import('./pages/admin/Register'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'))
const Home = lazy(() => import('./pages/admin/Home'))
const NguoiDungList = lazy(() => import('./pages/admin/user/NguoiDungList'))
const NguoiDungForm = lazy(() => import('./pages/admin/user/NguoiDungForm'))
const NhomNguoiDungList = lazy(() => import('./pages/admin/NhomNguoiDung/NhomNguoiDungList'))
const NhomNguoiDungForm = lazy(() => import('./pages/admin/NhomNguoiDung/NhomNguoiDungForm'))
const DieuHuongList = lazy(() => import('./pages/admin/DieuHuong/DieuHuongList'))
const DieuHuongForm = lazy(() => import('./pages/admin/DieuHuong/DieuHuongForm'))
const CategoriesList = lazy(() => import('./pages/admin/Categories/CategoriesList'))
const CategoriesForm = lazy(() => import('./pages/admin/Categories/CategoriesForm'))
const GamesList = lazy(() => import('./pages/admin/Games/GamesList'))
const GamesForm = lazy(() => import('./pages/admin/Games/GamesForm'))

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to='/admin/login' />
}

function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to='/admin/' />
}

export default function useRouteElements(){
    const routeElements = useRoutes([
        {
            path: 'admin',
            element: <ProtectedRoute/>,
            children: [
                {path: '',element: (<MainLayout> <Suspense><Home /></Suspense></MainLayout>),},
                {
                    path: 'user',
                    element: <MainLayout />,
                    children: [
                        {path: 'add',element: (<Suspense><NguoiDungForm /></Suspense>)},
                        {path: 'form/:id',element: (<Suspense><NguoiDungForm /></Suspense>)},
                        {path: '',element: (<Suspense><NguoiDungList /></Suspense>)}
                    ]
                },
                {
                    path: 'qtht-nhom-nguoi-dung',
                    element: <MainLayout />,
                    children: [
                        {path: 'add',element: (<Suspense><NhomNguoiDungForm /></Suspense>)},
                        {path: 'form/:id',element: (<Suspense><NhomNguoiDungForm /></Suspense>)},
                        {path: '',element: (<Suspense><NhomNguoiDungList /></Suspense>)}
                    ]
                },
                {
                    path: 'qtht-dieu-huong',
                    element: <MainLayout />,
                    children: [
                        {path: 'add', element: (<Suspense><DieuHuongForm /></Suspense>)},
                        {path: 'form/:id', element: (<Suspense><DieuHuongForm /></Suspense>)},
                        {path: '', element: (<Suspense><DieuHuongList /></Suspense>)}
                    ]
                },
                {
                    path: 'categories',
                    element: <MainLayout />,
                    children: [
                        {path: 'add', element: (<Suspense><CategoriesForm /></Suspense>)},
                        {path: 'form/:id', element: (<Suspense><CategoriesForm /></Suspense>)},
                        {path: '', element: (<Suspense><CategoriesList /></Suspense>)}
                    ]
                },
                {
                    path: 'games',
                    element: <MainLayout />,
                    children: [
                        {path: 'add', element: (<Suspense><GamesForm /></Suspense>)},
                        {path: 'form/:id', element: (<Suspense><GamesForm /></Suspense>)},
                        {path: '', element: (<Suspense><GamesList /></Suspense>)}
                    ]
                },
            ]
        },
        {
            path: 'admin',
            element: <RejectedRoute/>,
            children: [
                {path: path.register, element: <RegisterLayout />,
                    children: [
                        {path: '',element: (<Suspense><Register /></Suspense>)}
                    ]
                },
                {path: path.login,element: (<RegisterLayout><Suspense><Login /></Suspense></RegisterLayout>),},
                {path: path.forgotPassword,element: (<RegisterLayout><Suspense><ForgotPassword /></Suspense></RegisterLayout>),},
            ]
        },
        {
            path: '*',
            element: (
                <MainLayout> 
                    <Suspense>
                        <NotFound />
                    </Suspense>
                </MainLayout>
            )
        }
    ])

    return routeElements;
}