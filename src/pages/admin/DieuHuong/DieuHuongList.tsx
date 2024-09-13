
import dieuHuongApi from '../../../apis/dieuHuong.api'
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
import * as _ from "lodash";

interface FormData{
    ma: string
    ten: string
    duong_dan: string
    key_search: string
}

const initialFormState: FormData = {
    ma: '',
    ten: '',
    duong_dan: '',
    key_search: ''
}

export default function DieuHuongList() {
    const [show, setShow] = useState(false);
    const [idSelected, setIdSelected] = useState('');
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    let metaClone = _.cloneDeep(metaObj)
    metaClone.sort = {stt_order: 1}
    const [meta, setMeta] = useState(metaClone);

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

    const dieuHuongQuery = useQuery({
        queryKey: ['dieuHuong-list'],
        queryFn: () => {
            return dieuHuongApi.getMany(meta)
        },
    })

    const totalRecord = Number(dieuHuongQuery.data?.data?.meta?.total || 0)
    const totalPage = Math.ceil(totalRecord / meta.page_size)

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => dieuHuongApi.del(id)
    })

    const deleteMultiUserMutation = useMutation({
        mutationFn: (ids: string[]) => dieuHuongApi.deletes(ids)
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
                dieuHuongQuery.refetch()
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            dieuHuongQuery.data?.data?.data?.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
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

    useEffect(() => {
        if(ltsIdCheckbox.length === dieuHuongQuery.data?.data?.data?.length){
            setValue("all", true);
        }
    }, [ltsIdCheckbox])

    useEffect(() => {
        if (watch("all")) {
            let ltsId : string[]= [];
            dieuHuongQuery.data?.data?.data?.forEach((user: any) => {
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
            dieuHuongQuery.refetch()
        }, 100)
    }, [meta])

    const handleChange = (name: 'ma' | 'ten' | 'duong_dan' | 'key_search') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    }

    const handleDeleteMultiUser = () => {
        deleteMultiUserMutation.mutate(ltsIdCheckbox, {
            onSuccess: (_: any) => {
                dieuHuongQuery.refetch()
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
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

    const onSubmit = handleSubmit(data => {
        setMeta({
            ...meta,
            filter: {
                ma: data.ma,
                ten: data.ten,
                duong_dan: data.duong_dan
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
                    <h1>Danh sách điều hướng</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item active">Điều hướng</li>
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
                                        <Button type="button" className="btn btn-danger bg-gradient-danger btn-sm mr-1" onClick={handleDeleteMultiUser}>
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
                                                        <label htmlFor="">Mã</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="inputGroup-sizing-sm"
                                                                name="ma"
                                                                placeholder="Nhập mã"
                                                                register={register}
                                                                onChange={handleChange('ma')}
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Tên</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="inputGroup-sizing-sm"
                                                                name="ten"
                                                                placeholder="Nhập tên"
                                                                register={register}
                                                                onChange={handleChange('ten')}
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Đường dẫn</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="inputGroup-sizing-sm"
                                                                name="duong_dan"
                                                                placeholder="Nhập đường dẫn"
                                                                register={register}
                                                                onChange={handleChange('duong_dan')}
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
                                                <th>Mã</th>
                                                <th>Tên</th>
                                                <th>Đường dẫn</th>
                                                <th style={{width: 120}}>Hành động</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {dieuHuongQuery.data?.data?.data?.map((dieuHuong: any, idx: string) => (
                                                <tr key={dieuHuong.id}>
                                                    <td>{((page - 1) * meta.page_size) + idx + 1}</td>
                                                    <td>
                                                        <div className="icheck-primary d-inline">
                                                            <div>
                                                                <input 
                                                                    type="checkbox" 
                                                                    {...register(`checkbox_${dieuHuong.id}`)}
                                                                    name={`checkbox_${dieuHuong.id}`}
                                                                    onClick={(e) => handleSelectedItem(e.target, dieuHuong.id)}    
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`p-l-${(dieuHuong.cap_dieu_huong - 1) * 2}`}>{dieuHuong.ma}</td>
                                                    <td>{dieuHuong.ten}</td>
                                                    <td>{dieuHuong.duong_dan}</td>
                                                    <td>
                                                        <Link to={`form/${dieuHuong.id}`} title="Xem chi tiết" className="btn bg-gradient-info btn-xs">
                                                            <i className="fas fa-binoculars"></i>
                                                        </Link>
                                                        <button type="button" title="Xóa" onClick={() => handleShow(dieuHuong.id)} className="btn bg-gradient-danger btn-xs" data-toggle="modal" data-target="#modal-default">
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
                                        url={'qtht-dieu-huong'}
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
            </section>
        </div>

    )
}