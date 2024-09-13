import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import gamesApi from '../../../apis/games.api'
import categoriesApi from '../../../apis/categories.api'
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
import Textarea from '../../../components/common/Textarea'


interface FormData{
    ten: string
    mo_ta: string
    iframe: string
    so_thu_tu: number | null | undefined
    so_lan_choi: number | null | undefined
    like: number | null | undefined
    dislike: number | null | undefined
    category_id: string | null
    is_new: boolean
    is_trending: boolean
    su_dung: boolean
    ten_category: string
    img: string
    is_menu: boolean
    title: string
    description: string
}

const initialFormState: FormData = {
    ten: '',
    mo_ta: '',
    iframe: '',
    so_thu_tu: null,
    so_lan_choi: null,
    like: null,
    dislike: null,
    category_id: null,
    is_new: false,
    is_trending: false,
    su_dung: true,
    ten_category: '',
    img: '',
    is_menu: false,
    title: '',
    description: '',
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
export default function GamesForm() {
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
        queryKey: ['treeCategoriesForm'],
        queryFn: () => categoriesApi.treeCategoriesForm()
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
                category_id: ltsChecked[0].value,
            })
        }
        else{
            setFormState({
                ...formState,
                category_id: null,
            })
        }
    }

    const createCategoriesMutation = useMutation({
        // lấy dữ liệu kiểu FormData nhưng dùng Omit để bỏ field confirm_password
        mutationFn: (body: FormData) => gamesApi.create(body)
    })

    const updateCategoriesMutation = useMutation({
        mutationFn: (_) => gamesApi.update(formState, id as string)
    })

    const deleteCategoriesMutation = useMutation({
        mutationFn: (id: string) => gamesApi.del(id)
    })

    const gamesQuery = useQuery({
        queryKey: ['games', id],
        queryFn: () => gamesApi.getById(id as string),
        enabled: id !== undefined,
        staleTime: 1000 * 10
    })

    useEffect(() => {
        if (gamesQuery.data) {
            console.log(gamesQuery.data);
            
            setFormState(gamesQuery.data.data)
        }
    }, [gamesQuery.data])

    useEffect(() => {
        if (id !== undefined)
            setEditMode(false)
        else
            setEditMode(true)
    }, [id])

    const onEdit = () => {
        setEditMode(true)
    }

    const handleChange = (name: 'ten'|'mo_ta'|'so_thu_tu'|'category_id'|'su_dung'|'img'|'is_new'|'is_trending'|'so_lan_choi'|'like'|'dislike'|'iframe'|'is_menu'|'title'|'description') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (['su_dung', 'is_new', 'is_trending', 'is_menu'].includes(name)){
            setFormState((prev) => ({ ...prev, [name]: event.target.checked }))
        }
        else{
            setFormState((prev) => ({ ...prev, [name]: event.target.value }))
        }
        if (createCategoriesMutation.data || createCategoriesMutation.error) {
            createCategoriesMutation.reset()
        }
    }

    const onSubmit = handleSubmit(data => {
        if(id){
            updateCategoriesMutation.mutate(undefined, {
                onSuccess: (res) => {
                    setEditMode(false)
                    setFormState(res.data);
                    toast.success('Cập nhật games thành công!')
                },
                onError: (error) => {
                    toast.success(error.message)
                }
            })
        }
        else{
            let objClone = _.cloneDeep(formState)
            
            createCategoriesMutation.mutate(objClone, {
                onSuccess: (res) => {
                    if (res.data)
                        navigate(path.games)
                        toast.success(res.data.message)
                }
            })
        }
    })

    const handleDeleteMultiUser = () => {
        if(id){
            deleteCategoriesMutation.mutate(id, {
                onSuccess: (res: any) => {
                    navigate(path.games)
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
                    <h1>{editMode ? 'Thêm mới' : 'Cập nhật'}  games</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item"><Link to={path.games}>Games</Link></li>
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
                                                <Link to={path.games} className="btn bg-gradient-secondary btn-sm mr-1">
                                                    <i className="fas fa-step-backward"></i> Đóng
                                                </Link>
                                                {editMode ?
                                                    <Button type="submit" className="btn bg-gradient-primary btn-sm" disabled={updateCategoriesMutation.isPending}>
                                                        <i className="far fa-save"></i> Lưu
                                                    </Button>
                                                :
                                                    <React.Fragment>
                                                        <Button type="button" className="btn bg-gradient-danger btn-sm mr-1" onClick={handleShow} disabled={deleteCategoriesMutation.isPending}>
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
                                                            rules={rules.games_ten}
                                                            onChange={handleChange('ten')}
                                                        />
                                                        <TextErrorMessage message={errors.ten?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ten}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="category_id">Categories</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <SelectNvn 
                                                            data={dataTree || []} 
                                                            className='select_tree'
                                                            // mode="simpleSelect"
                                                            mode="radioSelect"
                                                            handleChange={(selectedNodes: any[]) => handleChangeSelect(selectedNodes)} 
                                                            value={formState.category_id}
                                                        />
                                                        <TextErrorMessage message={errors.category_id?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.ten_category}</p>}
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
                                                            onChange={handleChange('so_thu_tu')}
                                                        />
                                                        <TextErrorMessage message={errors.so_thu_tu?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.so_thu_tu}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="so_lan_choi">Số lần chơi</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="so_lan_choi"
                                                            type="text"
                                                            register={register}
                                                            name="so_lan_choi"
                                                            placeholder="Nhập số lần chơi"
                                                            value={formState.so_lan_choi}
                                                            onChange={handleChange('so_lan_choi')}
                                                        />
                                                        <TextErrorMessage message={errors.so_lan_choi?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.so_lan_choi}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="like">Lượt like</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="like"
                                                            type="text"
                                                            register={register}
                                                            name="like"
                                                            placeholder="Nhập lượt like"
                                                            value={formState.like}
                                                            onChange={handleChange('like')}
                                                        />
                                                        <TextErrorMessage message={errors.like?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.like}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="dislike">Lượt dislike</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="dislike"
                                                            type="text"
                                                            register={register}
                                                            name="dislike"
                                                            placeholder="Nhập lượt dislike"
                                                            value={formState.dislike}
                                                            onChange={handleChange('dislike')}
                                                        />
                                                        <TextErrorMessage message={errors.dislike?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.dislike}</p>}
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <label htmlFor="title">Title SEO</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="title"
                                                            type="text"
                                                            register={register}
                                                            name="title"
                                                            placeholder="Nhập title SEO"
                                                            value={formState.title}
                                                            rules={rules.games_title}
                                                            onChange={handleChange('title')}
                                                        />
                                                        <TextErrorMessage message={errors.title?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.title}</p>}
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <label htmlFor="description">Description SEO</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Textarea
                                                            className="form-control"
                                                            register={register}
                                                            name="description"
                                                            rows={10}
                                                            placeholder="Mô tả"
                                                            value={formState.description}
                                                            rules={rules.games_description}
                                                            onChange={handleChange('description')}
                                                        />
                                                        <TextErrorMessage message={errors.description?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.description}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="iframe">Link iframe</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="iframe"
                                                            type="text"
                                                            register={register}
                                                            name="iframe"
                                                            placeholder="Nhập link iframe"
                                                            value={formState.iframe}
                                                            onChange={handleChange('iframe')}
                                                        />
                                                        <TextErrorMessage message={errors.iframe?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.iframe}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="img">Link img</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Input 
                                                            className="form-control"
                                                            id="img"
                                                            type="text"
                                                            register={register}
                                                            name="img"
                                                            placeholder="Nhập link ảnh"
                                                            value={formState.img}
                                                            onChange={handleChange('img')}
                                                        />
                                                        <TextErrorMessage message={errors.img?.message}/>
                                                    </React.Fragment>
                                                    : <div><img src={formState.img} width="100px"/> </div>}
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <label htmlFor="Mota">Mô tả</label>
                                                    {editMode ?
                                                    <React.Fragment>
                                                        <Textarea
                                                            className="form-control"
                                                            register={register}
                                                            name="mo_ta"
                                                            rows={10}
                                                            placeholder="Mô tả"
                                                            value={formState.mo_ta}
                                                            rules={rules.games_mo_ta}
                                                            onChange={handleChange('mo_ta')}
                                                        />
                                                        <TextErrorMessage message={errors.mo_ta?.message}/>
                                                    </React.Fragment>
                                                    : <p className="form-control-static">{formState.mo_ta}</p>}
                                                </div>
                                                
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="su_dung">Sử dụng</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('su_dung')}
                                                                    name='su_dung'
                                                                    onChange={(handleChange('su_dung'))}
                                                                    checked={formState.su_dung}
                                                                    disabled={!editMode}
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.su_dung?.message}/>
                                                    </React.Fragment>
                                                </div>
                                                
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="is_new">Game mới</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('is_new')}
                                                                    name='is_new'
                                                                    onChange={(handleChange('is_new'))}
                                                                    checked={formState.is_new}
                                                                    disabled={!editMode}
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.is_new?.message}/>
                                                    </React.Fragment>
                                                </div>
                                                
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="is_trending">Game trending</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('is_trending')}
                                                                    name='is_trending'
                                                                    onChange={(handleChange('is_trending'))}
                                                                    checked={formState.is_trending}
                                                                    disabled={!editMode}
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.is_trending?.message}/>
                                                    </React.Fragment>
                                                </div>
                                                
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="is_menu">Hiển thị menu</label>
                                                    <React.Fragment>
                                                        <div className="form-group clearfix">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('is_menu')}
                                                                    name='is_menu'
                                                                    onChange={(handleChange('is_menu'))}
                                                                    checked={formState.is_menu}
                                                                    disabled={!editMode}
                                                                />
                                                        </div>
                                                        <TextErrorMessage message={errors.is_menu?.message}/>
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