import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import nhomNguoiDungApi from '../../../apis/nhomNguoiDung.api'
import path from '../../../constants/path'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { getRules } from '../../../utils/rules'
import TextErrorMessage from '../../../components/common/TextErrorMessage'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useMatch, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import ModalCustom from '../../../components/common/Modal'
import NguoiDungList from '../user/NguoiDungList'
import DanhSachNguoiDung from './DanhSachNguoiDung'
import PhanQuyen from './PhanQuyen'


interface FormData{
    ma: string
    ten: string
    mota: string
    ds_nguoidung: []
    ds_dieuhuong: []
}

const initialFormState: FormData = {
    ma: '',
    ten: '',
    mota: '',
    ds_nguoidung: [],
    ds_dieuhuong: []
}

export default function NhomNguoiDungForm() {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState<FormData>(initialFormState)
    const navigate = useNavigate()
    const { id } = useParams()
    
 
    const {
        register,
        handleSubmit,
        setError,
        watch, // làm component bị re-render
        getValues, // dựa theo event nào đó: click, ... (ko làm re-render như watch, còn event vẫn có thể re-render)
        formState: {
          errors
        }
    } = useForm<FormData>() 
    const rules = getRules(getValues)

    const createNhomNguoiDungMutation = useMutation({
        // lấy dữ liệu kiểu FormData nhưng dùng Omit để bỏ field confirm_password
        mutationFn: (body: FormData) => nhomNguoiDungApi.create(body)
    })

    const updateNhomNguoiDungMutation = useMutation({
        mutationFn: (_) => nhomNguoiDungApi.update(formState, id as string)
    })

    const deleteNhomNguoiDungMutation = useMutation({
        mutationFn: (id: string) => nhomNguoiDungApi.del(id)
    })

    const nhomNguoiDungQuery = useQuery({
        queryKey: ['nhomNguoiDung', id],
        queryFn: () => nhomNguoiDungApi.getById(id as string),
        enabled: id !== undefined,
        staleTime: 1000 * 10
    })

    useEffect(() => {
        if (nhomNguoiDungQuery.data) {
            setFormState(nhomNguoiDungQuery.data.data)
        }
    }, [nhomNguoiDungQuery.data])

    useEffect(() => {
        if (id !== undefined)
            setEditMode(false)
        else
            setEditMode(true)
    }, [id])

    const onEdit = () => {
        setEditMode(true)
    }

    const handleChange = (name: 'ma'| 'ten'| 'mota') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, [name]: event.target.value }))
        if (createNhomNguoiDungMutation.data || createNhomNguoiDungMutation.error) {
            createNhomNguoiDungMutation.reset()
        }
    }

    const refreshNhomNguoiDung = () => {
        nhomNguoiDungQuery.refetch()
    }

    const onSubmit = handleSubmit(data => {
        const body = data
        if(id){
            updateNhomNguoiDungMutation.mutate(undefined, {
                onSuccess: (res) => {
                    setEditMode(false)
                    setFormState(res.data);
                    toast.success(res.data.message)
                },
                onError: (error) => {
                    console.log(error)
                    toast.success(error.message)
                }
            })
        }
        else{
            createNhomNguoiDungMutation.mutate(body, {
                onSuccess: (res) => {
                    if (res.data)
                        navigate(path.nhomNguoiDung)
                        toast.success(res.data.message)
                }
            })
        }
    })

    const handleDeleteMultiUser = () => {
        if(id){
            deleteNhomNguoiDungMutation.mutate(id, {
                onSuccess: (res: any) => {
                    navigate(path.nhomNguoiDung)
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
                    <h1>{editMode ? 'Thêm mới' : 'Cập nhật'}  nhóm người dùng</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item"><Link to={path.nhomNguoiDung}>Nhóm người dùng</Link></li>
                        <li className="breadcrumb-item active">{editMode ? 'Thêm mới' : 'Cập nhật'}</li>
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
                                                <Link to={path.nhomNguoiDung} className="btn bg-gradient-secondary btn-sm mr-1">
                                                    <i className="fas fa-step-backward"></i> Đóng
                                                </Link>
                                                {editMode ?
                                                    <Button type="submit" className="btn bg-gradient-primary btn-sm" disabled={updateNhomNguoiDungMutation.isPending}>
                                                        <i className="far fa-save"></i> Lưu
                                                    </Button>
                                                :
                                                    <React.Fragment>
                                                        <Button type="button" className="btn bg-gradient-danger btn-sm mr-1" onClick={handleShow} disabled={deleteNhomNguoiDungMutation.isPending}>
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
                                                    <label htmlFor="ma">Mã</label> <label className='text-danger'>(*)</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            type="text"
                                                            id="ma"
                                                            register={register}
                                                            name="ma"
                                                            placeholder="Nhập mã"
                                                            value={formState.ma}
                                                            rules={rules.nhomNguoiDung_ma}
                                                            onChange={handleChange('ma')}
                                                        />
                                                        <TextErrorMessage message={errors.ma?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ma}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="Email">Tên</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="Tên"
                                                            type="text"
                                                            register={register}
                                                            name="ten"
                                                            placeholder="Tên"
                                                            value={formState.ten}
                                                            rules={rules.nhomNguoiDung_ten}
                                                            onChange={handleChange('ten')}
                                                        />
                                                        <TextErrorMessage message={errors.ten?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ten}</p>}
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="Mota">Mô tả</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="Mota"
                                                            type="text"
                                                            register={register}
                                                            name="mota"
                                                            placeholder="Mô tả"
                                                            value={formState.mota}
                                                            rules={rules.nhomNguoiDung_mota}
                                                            onChange={handleChange('mota')}
                                                        />
                                                        <TextErrorMessage message={errors.mota?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.mota}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                
                                {id &&
                                <>
                                    <DanhSachNguoiDung 
                                        id={id} 
                                        ds_nguoidung={formState.ds_nguoidung || []} 
                                        getNhomNguoiDungById={refreshNhomNguoiDung}
                                    />

                                    <PhanQuyen 
                                        id={id} 
                                        ds_dieuhuong={formState.ds_dieuhuong || []} 
                                        getNhomNguoiDungById={refreshNhomNguoiDung}
                                    />
                                </>
                                }
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