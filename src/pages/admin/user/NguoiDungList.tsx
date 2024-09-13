
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

export default function NguoiDungList() {
    const [show, setShow] = useState(false);
    const [showDelMulti, setShowDelMulti] = useState(false);
    const [idSelected, setIdSelected] = useState('');
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    const [meta, setMeta] = useState(metaObj);

    const [formState, setFormState] = useState<FormData>(initialFormState)
    const [searchParams] = useSearchParams()
    const searchParamsObject = Object.fromEntries([...searchParams])
    
    const page = Number(searchParamsObject.page) || 1;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return userApi.getUsers(meta)
        },
    })

    const totalRecord = Number(usersQuery.data?.data?.meta?.total || 0)
    const totalPage = Math.ceil(totalRecord / meta.page_size)

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => userApi.deleteUser(id)
    })

    const deleteMultiUserMutation = useMutation({
        mutationFn: (ids: string[]) => userApi.deleteUsers(ids)
    })


    const handleClose = () => setShow(false);
    const handleShow = (id: string) => {
        setShow(true);
        setIdSelected(id)
    }
    
    const deleteItem = () => {
        setShow(false);
        deleteUserMutation.mutate(idSelected, {
            onSuccess: (res: any) => {
                usersQuery.refetch()
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
        deleteMultiUserMutation.mutate(ltsIdCheckbox, {
            onSuccess: (_: any) => {
                setShowDelMulti(false);
                usersQuery.refetch()
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            usersQuery.data?.data?.data?.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
        }
    }

    const handleSelectedItem = (e: any, id: string) => {
        if (e.checked){
            setLtsIdCheckbox([...ltsIdCheckbox, id]);
            
        }
        else{
            setValue("all", false);
            setLtsIdCheckbox(ltsIdCheckbox ? ltsIdCheckbox.filter(x => x !== id) : []);
        }
    }

    useEffect(() => {
        if(ltsIdCheckbox.length === usersQuery.data?.data?.data?.length){
            setValue("all", true);
        }
    }, [ltsIdCheckbox])

    useEffect(() => {
        if (watch("all")) {
            let ltsId : string[]= [];
            usersQuery.data?.data?.data?.forEach((user: any) => {
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
            usersQuery.refetch()
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
            setMeta({
                ...meta,
                search: e.target.value
            })
        }
    }

    const onSubmit = handleSubmit(data => {
        setMeta({
            ...meta,
            filter: {
                email: data.email,
                username: data.username,
                phonenumber: data.phonenumber
            },
            search: formState.key_search
        })
    })

    const handleReset = () => {
        reset()
        setMeta({
            ...meta,
            filter: {},
            search: ''
        })
    }

    return(
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>Danh sách người dùng</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item active">Người dùng</li>
                    </ol>
                    </div>
                </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            <div className="card">
                                <div className="card-header d-flex">
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
                                        <Link to={'add'} className="btn bg-gradient-success btn-sm">
                                            <i className="fas fa-plus"></i> Thêm mới
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className='collapse' id="collapseExample">
                                    <div className="card-body">
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

                                <div className="card-body">
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
                                            {usersQuery.data?.data?.data?.map((user: any, idx: string) => (
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
                                                        <Link to={`form/${user.id}`} title="Xem chi tiết" className="btn bg-gradient-info btn-xs">
                                                            <i className="fas fa-binoculars"></i>
                                                        </Link>
                                                        <button type="button" title="Xóa" onClick={() => handleShow(user.id)} className="btn bg-gradient-danger btn-xs" data-toggle="modal" data-target="#modal-default">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer clearfix d-flex justify-content-between align-items-center">
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
                    </div>
                </div>

                <ModalCustom 
                    handleClose={handleClose}
                    title='Xác nhận xóa'
                    message='Bạn có chắc muốn xóa bản ghi này?'
                    show={show}
                    confirmFn={deleteItem}
                />

                <ModalCustom 
                    handleClose={handleDelMultiClose}
                    title='Xác nhận xóa'
                    message='Bạn có chắc muốn xóa các bản ghi này?'
                    show={showDelMulti}
                    confirmFn={deleteDelMultiItem}
                />
            </section>
        </div>

    )
}