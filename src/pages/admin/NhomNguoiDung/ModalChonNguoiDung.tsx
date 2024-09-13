import { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { Form, Col, Button, Modal, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Pagination from '../../../components/common/Pagination';
import metaObj from '../../../utils/metaObj'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import userApi from '../../../apis/user.api';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    show?: boolean,
    handleClose: () => void,
    confirmFn: (ltsIdCheckbox: any) => void,
    // watch?: any
}

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

export default function ModalChonNguoiDung(props: ButtonProps){
    const { show, title, handleClose, confirmFn, ...rest} = props
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    const [meta, setMeta] = useState(metaObj);

    const [formState, setFormState] = useState<FormData>(initialFormState)
    const [searchParams] = useSearchParams()
    const searchParamsObject = Object.fromEntries([...searchParams])
    
    const page = Number(searchParamsObject.page) || 1;

    const {
        register,
        handleSubmit,
        reset,
        watch,
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

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            usersQuery.data?.data?.data?.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
        }
    }

    const handleSelectedItem = (e: any, id: string) => {
        if (e.checked){
            setLtsIdCheckbox([...ltsIdCheckbox, id]);
            console.log(ltsIdCheckbox);
            
        }
        else{
            setValue("all", false);
            setLtsIdCheckbox(ltsIdCheckbox ? ltsIdCheckbox.filter(x => x != id) : []);
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

    useEffect(() => {
        setLtsIdCheckbox([]);
        usersQuery.data?.data?.data?.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
    }, [usersQuery.data?.data?.data])

    const handleChange = (name: 'username' | 'email' | 'phonenumber' | 'key_search') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev: any) => ({ ...prev, [name]: event.target.value }))
    }

    const handleChangePagasize = (val: any) => {
        setMeta({
            ...meta,
            page_size: val
        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            setMeta({
                ...meta,
                search: e.target.value
            })
        }
    }

    const onSubmit = handleSubmit((data: any) => {
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
        <Modal size='xl' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><i className="fas fa-user-plus text-success"></i> {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="card" style={{backgroundColor: '#f3f9ff'}}>
                    <h5 className='px-4 mt-3'>Danh sách người dùng trong nhóm</h5>
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
                                    <th style={{width: '150px', display: 'table-cell'}}>Số điện thoại</th>
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
                                        <td style={{display: 'table-cell'}}>{user.phonenumber}</td>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className='btn-sm' onClick={handleClose}>
                <i className="fas fa-times"></i> Đóng
                </Button>
                <Button variant="primary" className='btn-sm' onClick={() => confirmFn(ltsIdCheckbox)}>
                <i className="fas fa-check"></i> Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    )
}