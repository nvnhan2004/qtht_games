
import userApi from '../../../apis/user.api'
import path from '../../../constants/path'
import ModalCustom from '../../../components/common/Modal'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import metaObj from '../../../utils/metaObj'
import Pagination from '../../../components/common/Pagination'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { InputGroup } from 'react-bootstrap'
import ModalChonNguoiDung from './ModalChonNguoiDung'
import nhomNguoiDungApi from '../../../apis/nhomNguoiDung.api'
import * as _ from "lodash";

interface FormData{
    username: string
    email: string
    phonenumber: string
    key_search: string
}

const initialFormState: FormData = {
    username: '',
    email: '',
    phonenumber: '',
    key_search: ''
}

type PropsDanhSachNguoiDung = {
    ds_nguoidung: FormData[],
    getNhomNguoiDungById?: any,
    id: string | undefined,
    // watch: any
}

export default function DanhSachNguoiDung(props: PropsDanhSachNguoiDung) {
    const {getNhomNguoiDungById, id, ds_nguoidung} = props
    
    const [show, setShow] = useState(false);
    const [keySearch, setKeySearch] = useState('');
    const [dataNguoiDung, setDataNguoiDung] = useState(ds_nguoidung);
    const [showDelMulti, setShowDelMulti] = useState(false);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const [idSelected, setIdSelected] = useState('');
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    let metaClone = _.cloneDeep(metaObj)
    metaClone.filter = {
        nnd_id: id
    }
    const [meta, setMeta] = useState(metaClone);

    const [formState, setFormState] = useState<FormData>(initialFormState)
    const [searchParams] = useSearchParams()
    const searchParamsObject = Object.fromEntries([...searchParams])
    
    const page = Number(searchParamsObject.page) || 1;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    // const usersQuery = useQuery({
    //     queryKey: ['users'],
    //     queryFn: () => {
    //         return userApi.getUsers(meta)
    //     },
    // })

    const totalRecord = Number(dataNguoiDung.length || 0)
    const totalPage = Math.ceil(totalRecord / meta.page_size)

    const addUserToGroupMutation = useMutation({
        mutationFn: (obj: any) => nhomNguoiDungApi.addUsersToGroup(obj)
    })

    const handleClose = () => setShow(false);
    const handleShow = (id: string) => {
        setShow(true);
        setIdSelected(id)
    }
    
    const deleteItem = () => {
        const ltsId = dataNguoiDung.map((x: any) => {
            if(x.id !== idSelected)
                return x.id
        })
        
        let obj = {
            nhom_id: id,
            lts_nguoi_dung_id: ltsId.filter(x => x !== undefined)
        }
        addUserToGroupMutation.mutate(obj, {
            onSuccess: (_: any) => {
                getNhomNguoiDungById()
                setShow(false);
                toast.success('Thêm người dùng vào nhóm thành công!')
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    

    const handleDelMultiClose = () => setShow(false);
    const handleShowDelMulti = () => {
        setShowDelMulti(true);
    }
    
    const deleteDelMultiItem = () => {
        const ltsId = dataNguoiDung.map((x: any) => {
            if(!ltsIdCheckbox.includes(x.id))
                return x.id
        })
        let obj = {
            nhom_id: id,
            lts_nguoi_dung_id: ltsId.filter(x => x !== undefined)
        }
        addUserToGroupMutation.mutate(obj, {
            onSuccess: (_: any) => {
                getNhomNguoiDungById()
                setShowDelMulti(false);
                toast.success('Xóa người dùng khỏi nhóm thành công!')
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            dataNguoiDung.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
        }
    }

    const handleSelectedItem = (e: any, id: string) => {
        if (e.checked){
            setLtsIdCheckbox([...ltsIdCheckbox, id]);
            
        }
        else{
            setValue("all", false);
            setLtsIdCheckbox(ltsIdCheckbox ? ltsIdCheckbox.filter(x => x != id) : []);
        }
    }

    // Xử lý thêm người dùng vào nhóm
    const handleShowAddUser = () => {
        setShowModalAddUser(true)
    }

    const handleAddUserToGroup = (ltsIdUser: any) => {
        let obj = {
            nhom_id: id,
            lts_nguoi_dung_id: ltsIdUser
        }
        addUserToGroupMutation.mutate(obj, {
            onSuccess: (_: any) => {
                getNhomNguoiDungById()
                setShowModalAddUser(false)
                toast.success('Thêm người dùng vào nhóm thành công!')
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
        
    }
    const handleCloseAddUserToGroup = () => setShowModalAddUser(false);
    // end Xử lý thêm người dùng vào nhóm

    useEffect(() => {
        setDataNguoiDung(ds_nguoidung)
    }, [ds_nguoidung])

    useEffect(() => {
        if(ltsIdCheckbox.length === dataNguoiDung.length){
            setValue("all", true);
        }
    }, [ltsIdCheckbox])

    useEffect(() => {
        if (watch("all")) {
            let ltsId : string[]= [];
            dataNguoiDung.forEach((user: any) => {
                ltsId.push(user.id);
                setValue(`checkbox_${user.id}`, true);
            });
            
            setLtsIdCheckbox([]);
            setLtsIdCheckbox([...ltsId]);
        }
    }, [watch().all]);

    useEffect(() => {
        setMeta({
            ...meta,
            page: page
        })
    }, [page])

    useEffect(() => {
        setTimeout(() => {
            getNhomNguoiDungById()
        }, 100)
    }, [meta])

    const handleChange = (name: 'username' | 'email' | 'phonenumber' | 'key_search') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    }

    const handleChangePagasize = (val: any) => {
        setMeta({
            ...meta,
            page_size: val
        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            let userSearch = props.ds_nguoidung.filter(x => x.username.includes(formState.username) && 
                x.email.includes(formState.email) && 
                x.phonenumber.includes(formState.phonenumber) &&
                (x.username.includes(e.target.value) || x.email.includes(e.target.value) || x.phonenumber.includes(e.target.value)))
                setDataNguoiDung(userSearch)
        }
    }

    const onSubmit = handleSubmit(data => {
        let userSearch = props.ds_nguoidung.filter(x => 
            x.username.includes(data.username) && 
            x.email.includes(data.email) && 
            x.phonenumber.includes(data.phonenumber) &&
            (x.username.includes(formState.key_search) || x.email.includes(formState.key_search) || x.phonenumber.includes(formState.key_search)))
        setDataNguoiDung(userSearch)
    })

    const handleReset = () => {
        reset()
        setDataNguoiDung(props.ds_nguoidung)
    }

    return(
        <div className="col-xs-12 col-md-12">
            <div className="card" style={{backgroundColor: '#f3f9ff'}}>
                <div className="card-header">
                    <h3 className="card-title">Danh sách người dùng trong nhóm</h3>
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus" />
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="">
                        <div className="mt-1 mb-4 d-flex">
                            <div className="col-xs-12 col-md-4">
                                <div className="input-group input-group-sm">
                                    <input type="text" className="form-control" onChange={handleChange('key_search')} onKeyDown={handleKeyDown} placeholder='Tìm kiếm nhanh và enter'/>
                                    <span className="input-group-append">
                                        <button type="button" className="btn btn-info btn-flat disabled"><i className="fas fa-search"></i></button>
                                    </span>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-8 text-right">
                                <Button className="btn btn-info bg-gradient-info btn-sm mr-1" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                    <i className="fas fa-search-plus"></i> Tìm kiếm nâng cao
                                </Button>
                                {ltsIdCheckbox.length > 0 &&
                                <Button type="button" className="btn btn-danger bg-gradient-danger btn-sm mr-1" onClick={handleShowDelMulti}>
                                    <i className="far fa-trash-alt"></i> Xóa
                                </Button>}
                                <button type="button" title="Thêm người dùng" onClick={handleShowAddUser} className="btn bg-gradient-success btn-sm" data-toggle="modal" data-target="#modal-default">
                                    <i className="fas fa-plus"></i> Thêm người dùng
                                </button>
                            </div>
                        </div>
                        
                        <div className='collapse' id="collapseExample">
                            <div className="card-body pt-0">
                                <form noValidate onSubmit={(e) => onSubmit(e)}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="">Tài khoản</label>
                                                <InputGroup size="sm" className="mb-3">
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        aria-describedby="inputGroup-sizing-sm"
                                                        name="username"
                                                        placeholder="Tài khoản"
                                                        register={register}
                                                        onChange={handleChange('username')}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <InputGroup size="sm" className="mb-3">
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        aria-describedby="inputGroup-sizing-sm"
                                                        name="email"
                                                        placeholder="Email"
                                                        register={register}
                                                        onChange={handleChange('email')}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Số điện thoại</label>
                                                <InputGroup size="sm" className="mb-3">
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        aria-describedby="inputGroup-sizing-sm"
                                                        name="phonenumber"
                                                        placeholder="Số điện thoại"
                                                        register={register}
                                                        onChange={handleChange('phonenumber')}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row d-flex justify-content-center">
                                        <Button className="btn btn-light bg-gradient-light btn-sm mr-1" onClick={handleReset} type="button">
                                            <i className="fas fa-sync"></i> Reset
                                        </Button>
                                        <Button className="btn btn-primary bg-gradient-primary btn-sm mr-1" type="submit">
                                            <i className="fas fa-search"></i> Tìm kiếm
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered table-sm shadow-sm rounded">
                                    <thead>
                                    <tr className='bg-gradient-info'>
                                        <th>#</th>
                                        <th>
                                            <div className="icheck-primary d-inline">
                                                <div>
                                                    <input 
                                                        type="checkbox" 
                                                        {...register("all")}
                                                        onClick={(e) => handleSelectAll(e.target)}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th>Tài khoản</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th style={{width: 120}}>Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dataNguoiDung.map((user: any, idx: number) => (
                                        <tr key={user.id}>
                                            <td>{((page - 1) * meta.page_size) + idx + 1}</td>
                                            <td>
                                                <div className="icheck-primary d-inline">
                                                    <div>
                                                        <input 
                                                            type="checkbox" 
                                                            {...register(`checkbox_${user.id}`)}
                                                            name={`checkbox_${user.id}`}
                                                            onClick={(e) => handleSelectedItem(e.target, user.id)}    
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phonenumber}</td>
                                            <td>
                                                <button type="button" title="Xóa người dùng khỏi nhóm" onClick={() => handleShow(user.id)} className="btn bg-gradient-danger btn-xs" data-toggle="modal" data-target="#modal-default">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination 
                            handleChangePagasize={handleChangePagasize}
                            meta={meta}
                            total={totalRecord}
                            totalPage={totalPage}
                            page={page}
                            url={'user'}
                        />
            
                    </div>
                </div>
            </div>
            <ModalCustom 
                handleClose={handleClose}
                title='Xác nhận xóa'
                message='Bạn có chắc muốn xóa người dùng khỏi nhóm?'
                show={show}
                confirmFn={deleteItem}
            />

            <ModalCustom 
                handleClose={handleDelMultiClose}
                title='Xác nhận xóa'
                message='Bạn có chắc muốn xóa những người dùng này khỏi nhóm?'
                show={showDelMulti}
                confirmFn={deleteDelMultiItem}
            />
        
            <ModalChonNguoiDung 
                handleClose={handleCloseAddUserToGroup}
                title='Thêm người dùng vào nhóm'
                show={showModalAddUser}
                confirmFn={(users: any) => handleAddUserToGroup(users)}
                // watch={watch}
            />
        </div>
    )
}