import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import dieuHuongApi from '../../../apis/dieuHuong.api'
import path from '../../../constants/path'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { getRules } from '../../../utils/rules'
import TextErrorMessage from '../../../components/common/TextErrorMessage'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { toast } from 'react-toastify'
import { useMatch, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import ModalCustom from '../../../components/common/Modal'
import SelectNvn from '../../../components/common/Select'
import * as _ from "lodash";


interface FormData{
    ma: string
    ten: string
    mo_ta: string
    duong_dan: string
    icon: string
    so_thu_tu: number | null | undefined
    dieu_huong_cap_tren_id: string | null
    super_admin: boolean
    is_router: boolean
    ten_dieu_huong_cap_tren: string
    dieu_huong_cap_tren: any
}

const initialFormState: FormData = {
    ma: '',
    ten: '',
    mo_ta: '',
    duong_dan: '',
    icon: '',
    so_thu_tu: null,
    dieu_huong_cap_tren_id: null,
    super_admin: false,
    is_router: true,
    ten_dieu_huong_cap_tren: '',
    dieu_huong_cap_tren: {}
}
// const data1 = {
//     label: 'search me',
//     value: 'searchme',
//     children: [
//       {
//         label: 'search me too',
//         value: 'searchmetoo',
//         // checked: true,
//         children: [
//           {
//             label: 'No one can get me',
//             value: 'anonymous',
//           },
//         ],
//       },
//     ],
//   }
export default function DieuHuongForm() {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState<FormData>(initialFormState)
    const [dataTree, setDataTree] = useState([]);
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

    const { data: fetchedData } = useQuery({
        queryKey: ['treeDieuHuongForm'],
        queryFn: () => dieuHuongApi.treeDieuHuongForm()
    });

    useEffect(() => {
        if (fetchedData) {
            setDataTree(fetchedData?.data);
        }
    }, [fetchedData]);

    const handleChangeSelect = (ltsChecked: any[]) => {
        if (ltsChecked.length > 0){
            setFormState({
                ...formState,
                dieu_huong_cap_tren_id: ltsChecked[0].value,
            })
        }
        else{
            setFormState({
                ...formState,
                dieu_huong_cap_tren_id: null,
            })
        }
    }

    const createDieuHuongMutation = useMutation({
        // lấy dữ liệu kiểu FormData nhưng dùng Omit để bỏ field confirm_password
        mutationFn: (body: FormData) => dieuHuongApi.create(body)
    })

    const updateDieuHuongMutation = useMutation({
        mutationFn: (_) => dieuHuongApi.update(formState, id as string)
    })

    const deleteDieuHuongMutation = useMutation({
        mutationFn: (id: string) => dieuHuongApi.del(id)
    })

    const dieuHuongQuery = useQuery({
        queryKey: ['dieuHuong', id],
        queryFn: () => dieuHuongApi.getById(id as string),
        enabled: id !== undefined,
        staleTime: 1000 * 10
    })

    useEffect(() => {
        if (dieuHuongQuery.data) {
            setFormState(dieuHuongQuery.data.data)
        }
    }, [dieuHuongQuery.data])

    useEffect(() => {
        if (id !== undefined)
            setEditMode(false)
        else
            setEditMode(true)
    }, [id])

    const onEdit = () => {
        setEditMode(true)
    }

    const handleChange = (name: 'ma'|'ten'|'mo_ta'|'duong_dan'|'icon'|'so_thu_tu'|'dieu_huong_cap_tren_id'|'super_admin'|'is_router') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (['super_admin','is_router'].includes(name)){
            setFormState((prev) => ({ ...prev, [name]: event.target.checked }))
        }
        else{
            setFormState((prev) => ({ ...prev, [name]: event.target.value }))
        }
        if (createDieuHuongMutation.data || createDieuHuongMutation.error) {
            createDieuHuongMutation.reset()
        }
    }

    const onSubmit = handleSubmit(data => {
        const body = data
        if(id){
            updateDieuHuongMutation.mutate(undefined, {
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
            let objClone = _.cloneDeep(formState)
            objClone.dieu_huong_cap_tren = objClone.dieu_huong_cap_tren[0]
            
            createDieuHuongMutation.mutate(objClone, {
                onSuccess: (res) => {
                    if (res.data)
                        navigate(path.dieuHuong)
                        toast.success(res.data.message)
                }
            })
        }
    })

    const handleDeleteMultiUser = () => {
        if(id){
            deleteDieuHuongMutation.mutate(id, {
                onSuccess: (res: any) => {
                    navigate(path.dieuHuong)
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
                    <h1>{editMode ? 'Thêm mới' : 'Cập nhật'}  điều hướng</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item"><Link to={path.dieuHuong}>Điều hướng</Link></li>
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
                                                <Link to={path.dieuHuong} className="btn bg-gradient-secondary btn-sm mr-1">
                                                    <i className="fas fa-step-backward"></i> Đóng
                                                </Link>
                                                {editMode ?
                                                    <Button type="submit" className="btn bg-gradient-primary btn-sm" disabled={updateDieuHuongMutation.isPending}>
                                                        <i className="far fa-save"></i> Lưu
                                                    </Button>
                                                :
                                                    <React.Fragment>
                                                        <Button type="button" className="btn bg-gradient-danger btn-sm mr-1" onClick={handleShow} disabled={deleteDieuHuongMutation.isPending}>
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
                                                            rules={rules.dieuHuong_ma}
                                                            onChange={handleChange('ma')}
                                                        />
                                                        <TextErrorMessage message={errors.ma?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ma}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="ten">Tên</label> <label className='text-danger'>(*)</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="ten"
                                                            type="text"
                                                            register={register}
                                                            name="ten"
                                                            placeholder="Nhập tên"
                                                            value={formState.ten}
                                                            rules={rules.dieuHuong_ten}
                                                            onChange={handleChange('ten')}
                                                        />
                                                        <TextErrorMessage message={errors.ten?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ten}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="duong_dan">Đường dẫn</label> <label className='text-danger'>(*)</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="duong_dan"
                                                            type="text"
                                                            register={register}
                                                            name="duong_dan"
                                                            placeholder="Nhập đường dẫn"
                                                            value={formState.duong_dan}
                                                            rules={rules.dieuHuong_duong_dan}
                                                            onChange={handleChange('duong_dan')}
                                                        />
                                                        <TextErrorMessage message={errors.duong_dan?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.duong_dan}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="icon">Icon</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="icon"
                                                            type="text"
                                                            register={register}
                                                            name="icon"
                                                            placeholder="Icon"
                                                            value={formState.icon}
                                                            rules={rules.dieuHuong_icon}
                                                            onChange={handleChange('icon')}
                                                        />
                                                        <TextErrorMessage message={errors.icon?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.icon}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="so_thu_tu">Số thứ tự</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="so_thu_tu"
                                                            type="text"
                                                            register={register}
                                                            name="so_thu_tu"
                                                            placeholder="Nhập số thứ tự"
                                                            value={formState.so_thu_tu}
                                                            rules={rules.dieuHuong_so_thu_tu}
                                                            onChange={handleChange('so_thu_tu')}
                                                        />
                                                        <TextErrorMessage message={errors.so_thu_tu?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.so_thu_tu}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="dieu_huong_cap_tren_id">Điều hướng cấp trên</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <SelectNvn 
                                                            data={dataTree || []} 
                                                            className='select_tree'
                                                            // mode="simpleSelect"
                                                            mode="radioSelect"
                                                            handleChange={(selectedNodes: any[]) => handleChangeSelect(selectedNodes)} 
                                                            value={formState.dieu_huong_cap_tren_id}
                                                        />
                                                        <TextErrorMessage message={errors.dieu_huong_cap_tren_id?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ten_dieu_huong_cap_tren}</p>}
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
                                                            name="mo_ta"
                                                            placeholder="Mô tả"
                                                            value={formState.mo_ta}
                                                            rules={rules.dieuHuong_mo_ta}
                                                            onChange={handleChange('mo_ta')}
                                                        />
                                                        <TextErrorMessage message={errors.mo_ta?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.mo_ta}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="super_admin">Dành cho super admin</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('super_admin')}
                                                                    name='super_admin'
                                                                    onChange={handleChange('super_admin')}
                                                                    checked={formState.super_admin}
                                                                    disabled={!editMode} 
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.super_admin?.message}/>
                                                    </React.Fragment>
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="is_router">Là đường dẫn</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('is_router')}
                                                                    name='is_router'
                                                                    onChange={(handleChange('is_router'))}
                                                                    checked={formState.is_router}
                                                                    disabled={!editMode}
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.is_router?.message}/>
                                                    </React.Fragment>
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