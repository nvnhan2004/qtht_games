import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import userApi from '../../../apis/user.api'
import path from '../../../constants/path'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { getRules } from '../../../utils/rules'
import TextErrorMessage from '../../../components/common/TextErrorMessage'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { ErrorResponse } from '../../../types/utils.type'
import { useMatch, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import ModalCustom from '../../../components/common/Modal'


interface FormData{
    username: string
    email: string
    password: string
    confirm_password: string
    phonenumber: string
    roles: any
}

const initialFormState: FormData = {
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    phonenumber: '',
    roles: ['User']
}

export default function NguoiDungForm() {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState<FormData>(initialFormState)
    const navigate = useNavigate()
    const { id } = useParams()
    
 
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
    const rules = getRules(getValues)

    const createUserMutation = useMutation({
        // lấy dữ liệu kiểu FormData nhưng dùng Omit để bỏ field confirm_password
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => userApi.createAccount(body)
    })

    const updateUserMutation = useMutation({
        mutationFn: (_) => userApi.updateUser(id as string, formState)
    })

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => userApi.deleteUser(id)
    })

    const userQuery = useQuery({
        queryKey: ['user', id],
        queryFn: () => userApi.getUser(id as string),
        enabled: id !== undefined,
        staleTime: 1000 * 10
    })

    useEffect(() => {
        if (userQuery.data) {
            setFormState(userQuery.data.data)
        }
    }, [userQuery.data])

    useEffect(() => {
        if (id !== undefined)
            setEditMode(false)
        else
            setEditMode(true)
    }, [id])

    const onEdit = () => {
        setEditMode(true)
    }

    const handleChange = (name: 'username'| 'email'| 'password'| 'confirm_password'| 'phonenumber') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, [name]: event.target.value }))
        if (createUserMutation.data || createUserMutation.error) {
            createUserMutation.reset()
        }
    }

    const onSubmit = handleSubmit(data => {
        const body = omit(data, ['confirm_password'])
        body.roles = ['User']
        if(id){
            updateUserMutation.mutate(undefined, {
                onSuccess: (res) => {
                    setEditMode(false)
                    toast.success(res.data.message)
                },
                onError: (error) => {
                    toast.success(error.message)
                }
            })
        }
        else{
            createUserMutation.mutate(body, {
                onSuccess: (res) => {
                    if (res.data.isSuccess)
                        navigate(path.user)
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
                    }
                }
            })
        }
    })

    const handleDeleteMultiUser = () => {
        if(id){
            deleteUserMutation.mutate(id, {
                onSuccess: (res: any) => {
                    navigate(path.user)
                },
                onError: (error) => {
                    toast.error(error?.message)
                }
            })
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    return(
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>{editMode ? 'Thêm mới' : 'Cập nhật'}  người dùng</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item"><Link to={path.user}>Người dùng</Link></li>
                        <li className="breadcrumb-item active">Thêm mới</li>
                    </ol>
                    </div>
                </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <form noValidate onSubmit={onSubmit}>
                                    <div className="card-header d-flex">
                                        <div className="col-md-6">
                                            
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-right">
                                                <Link to={path.user} className="btn bg-gradient-secondary btn-sm mr-1">
                                                    <i className="fas fa-step-backward"></i> Đóng
                                                </Link>
                                                {editMode ?
                                                    <Button type="submit" className="btn bg-gradient-primary btn-sm" disabled={updateUserMutation.isPending}>
                                                        <i className="far fa-save"></i> Lưu
                                                    </Button>
                                                :
                                                    <React.Fragment>
                                                        <Button type="button" className="btn bg-gradient-danger btn-sm mr-1" onClick={handleShow} disabled={deleteUserMutation.isPending}>
                                                            <i className="far fa-trash-alt"></i> Xóa
                                                        </Button>
                                                        <Button type="button" className="btn bg-gradient-warning btn-sm mr-1" onClick={onEdit}>
                                                            <i className="far fa-edit"></i> Sửa
                                                        </Button>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="Username">Tài khoản</label> <label className='text-danger'>(*)</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            type="text"
                                                            id="Username"
                                                            register={register}
                                                            name="username"
                                                            placeholder="Tài khoản"
                                                            value={formState.username}
                                                            rules={(editMode && !Boolean(id)) ? rules.username : {}}
                                                            // rules={rules.username}
                                                            onChange={handleChange('username')}
                                                            disabled={editMode && Boolean(id)}
                                                        />
                                                        {/* <input
                                                            id="Username"
                                                            className="form-control"
                                                            type="text"
                                                            {...register("username", rules.username)}
                                                            name="Username"
                                                            placeholder="Nhập mã"
                                                            value={formState.username}
                                                            onChange={handleChange('username')}
                                                        /> */}
                                                        <TextErrorMessage message={errors.username?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.username}</p>}
                                                </div>
                                                {(editMode && id === undefined) &&
                                                <React.Fragment>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="Password">Mật khẩu</label> <label className='text-danger'>(*)</label>
                                                        <Input 
                                                            className="form-control"
                                                            id="Password"
                                                            type="password"
                                                            register={register}
                                                            name="password"
                                                            placeholder="Mật khẩu"
                                                            rules={rules.password}
                                                            value={formState.password}
                                                            autoComplete='on'
                                                            onChange={handleChange('password')}
                                                        />
                                                        <TextErrorMessage message={errors.password?.message}/>
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="RePassword">Nhập lại mật khẩu</label> <label className='text-danger'>(*)</label>
                                                        <Input 
                                                            className="form-control"
                                                            id="RePassword"
                                                            type="password"
                                                            register={register}
                                                            name="confirm_password"
                                                            placeholder="Nhập lại mật khẩu"
                                                            rules={rules.confirm_password}
                                                            value={formState.confirm_password}
                                                            autoComplete='on'
                                                            onChange={handleChange('confirm_password')}
                                                        />
                                                        <TextErrorMessage message={errors.confirm_password?.message}/>
                                                    </div>
                                                </React.Fragment>
                                                }
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="Email">Email</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="Email"
                                                            type="email"
                                                            register={register}
                                                            name="email"
                                                            placeholder="Email"
                                                            value={formState.email}
                                                            rules={rules.email}
                                                            onChange={handleChange('email')}
                                                        />
                                                        <TextErrorMessage message={errors.email?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.email}</p>}
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="Phone">Số điện thoại</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="Phone"
                                                            type="text"
                                                            register={register}
                                                            name="phonenumber"
                                                            placeholder="Số điện thoại"
                                                            value={formState.phonenumber}
                                                            rules={rules.phonenumber}
                                                            onChange={handleChange('phonenumber')}
                                                        />
                                                        <TextErrorMessage message={errors.phonenumber?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.phonenumber}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                

                <ModalCustom 
                    handleClose={handleClose}
                    title='Xác nhận xóa'
                    message='Bạn có chắc muốn xóa bản ghi này?'
                    show={show}
                    confirmFn={handleDeleteMultiUser}
                />
            </section>
        </div>

    )
}