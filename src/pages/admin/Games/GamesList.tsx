
import gamesApi from '../../../apis/games.api'
import categoriesApi from '../../../apis/categories.api'
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
import SelectNvn from '../../../components/common/Select'
import ModalCrawlGames from './ModalCrawlGames'

interface FormData{
    ten: string
    is_new: boolean
    is_trending: boolean
    so_thu_tu: string
    key_search: string
    category_id: string | null
}

const initialFormState: FormData = {
    ten: '',
    is_new: false,
    is_trending: false,
    so_thu_tu: '',
    key_search: '',
    category_id: ''
}

export default function GamesList() {
    const [show, setShow] = useState(false);
    const [idSelected, setIdSelected] = useState('');
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    const [showModalCrawlGames, setShowModalCrawlGames] = useState(false);
    const [dataTree, setDataTree] = useState([]);
    let metaClone = _.cloneDeep(metaObj)
    metaClone.sort = {so_thu_tu: 1}
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


    const { data: fetchedData } = useQuery({
        queryKey: ['treeCategoriesForm'],
        queryFn: () => categoriesApi.treeCategoriesForm()
    });

    useEffect(() => {
        if (fetchedData) {
            setDataTree(fetchedData?.data);
        }
    }, [fetchedData]);

    const gamesQuery = useQuery({
        queryKey: ['games-list'],
        queryFn: () => {
            return gamesApi.getMany(meta)
        },
    })

    const totalRecord = Number(gamesQuery.data?.data?.meta?.total || 0)
    const totalPage = Math.ceil(totalRecord / meta.page_size)

    const deleteGameMutation = useMutation({
        mutationFn: (id: string) => gamesApi.del(id)
    })

    const deleteMultiUserMutation = useMutation({
        mutationFn: (ids: string[]) => gamesApi.deletes(ids)
    })


    const handleClose = () => setShow(false);
    const handleShow = (id: string) => {
        setShow(true);
        setIdSelected(id)
    }
    
    const deleteItem = () => {
        setShow(false);
        deleteGameMutation.mutate(idSelected, {
            onSuccess: (res: any) => {
                gamesQuery.refetch()
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            gamesQuery.data?.data?.data?.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
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
        if(ltsIdCheckbox.length === gamesQuery.data?.data?.data?.length){
            setValue("all", true);
        }
    }, [ltsIdCheckbox])

    useEffect(() => {
        if (watch("all")) {
            let ltsId : string[]= [];
            gamesQuery.data?.data?.data?.forEach((user: any) => {
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
            gamesQuery.refetch()
        }, 100)
    }, [meta])

    const handleChange = (name: 'is_new' | 'ten' | 'is_trending' | 'so_thu_tu' | 'key_search' | 'category_id') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (['is_new', 'is_trending'].includes(name)){
            setFormState((prev) => ({ ...prev, [name]: event.target.checked }))
        }
        else{
            setFormState((prev) => ({ ...prev, [name]: event.target.value }))
        }
    }

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

    const handleDeleteMultiUser = () => {
        deleteMultiUserMutation.mutate(ltsIdCheckbox, {
            onSuccess: (_: any) => {
                gamesQuery.refetch()
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
                ten: formState.ten,
                is_new: formState.is_new ? formState.is_new : '',
                is_trending: formState.is_trending ? formState.is_trending : '',
                category_id: formState.category_id,
            },
            search: formState.key_search
        })
    })

    const handleReset = () => {
        reset()
        setFormState(initialFormState)
        setMeta({
            ...meta,
            filter: {},
            search: ''
        })
    }

    // Xử lý thêm người dùng vào nhóm
    const crawlGamesMutation = useMutation({
        mutationFn: (obj: any) => gamesApi.crawlGames(obj)
    })

    const handleShowModalCrawl = () => {
        setShowModalCrawlGames(true)
    }

    const handleCrawlGames = (obj: any) => {
        crawlGamesMutation.mutate(obj, {
            onSuccess: (res: any) => {
                setShowModalCrawlGames(false)
                toast.success(res.data.message)
                gamesQuery.refetch()
            },
            onError: (error: any) => {
                toast.error(error?.message)
            }
        })
    }
    const handleCloseCrawlGames = () => setShowModalCrawlGames(false);
    // end Xử lý thêm người dùng vào nhóm

    return(
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>Danh sách games</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to={path.home}>Tổng quan</Link></li>
                        <li className="breadcrumb-item active">Games</li>
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
                                        <Button className="btn btn-dark bg-gradient-dark btn-sm mr-1" type="button" title='https://www.gamesgames.com/' onClick={handleShowModalCrawl} data-toggle="modal" data-target="#modal-crawl-games">
                                            <i className="fas fa-database"></i> Crawl dữ liệu
                                        </Button>
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
                                                        <label>Tên</label>
                                                        <InputGroup className="mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                // aria-describedby="inputGroup-sizing-sm"
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
                                                        <label>Số thứ tự</label>
                                                        <InputGroup className="mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                // aria-describedby="inputGroup-sizing-sm"
                                                                name="so_thu_tu"
                                                                placeholder="Nhập số thứ tự"
                                                                register={register}
                                                                onChange={handleChange('so_thu_tu')}
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Categories</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <div style={{width: '100%'}}>
                                                                <SelectNvn 
                                                                    data={dataTree || []} 
                                                                    className='select_tree'
                                                                    mode="radioSelect"
                                                                    name='category_id'
                                                                    // register={register}
                                                                    handleChange={(selectedNodes: any[]) => handleChangeSelect(selectedNodes)} 
                                                                    value={formState.category_id}
                                                                />
                                                            </div>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Games mới</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary1"
                                                                    {...register('is_new')}
                                                                    name='is_new'
                                                                    onChange={(handleChange('is_new'))}
                                                                    checked={formState.is_new}
                                                                />
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Games trending</label>
                                                        <InputGroup size="sm" className="mb-3">
                                                            <input 
                                                                style={{width: '22px', height: '22px', marginTop: '8px'}}
                                                                    type="checkbox" 
                                                                    id="checkboxPrimary2"
                                                                    {...register('is_trending')}
                                                                    name='is_trending'
                                                                    onChange={(handleChange('is_trending'))}
                                                                    checked={formState.is_trending}
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
                                                <th>Tên</th>
                                                <th>Categories</th>
                                                <th>Số lần chơi</th>
                                                <th>Lượt like</th>
                                                <th>Lượt dislike</th>
                                                <th>Sử dụng</th>
                                                <th style={{width: "80px"}}>New</th>
                                                <th style={{width: "80px"}}>Trending</th>
                                                <th style={{width: 120}}>Hành động</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {gamesQuery.data?.data?.data?.map((games: any, idx: string) => (
                                                <tr key={games.id}>
                                                    <td>{((page - 1) * meta.page_size) + idx + 1}</td>
                                                    <td>
                                                        <div className="icheck-primary d-inline">
                                                            <div>
                                                                <input 
                                                                    type="checkbox" 
                                                                    {...register(`checkbox_${games.id}`)}
                                                                    name={`checkbox_${games.id}`}
                                                                    onClick={(e) => handleSelectedItem(e.target, games.id)}    
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{width: '20%'}}>{games.ten}</td>
                                                    <td>{games.ten_category}</td>
                                                    <td className='text-right'>{games.so_lan_choi}</td>
                                                    <td className='text-right'>{games.like}</td>
                                                    <td className='text-right'>{games.dislike}</td>
                                                    <td className='text-center'><span className={games.su_dung ? 'badge bg-success' : 'badge bg-danger'}>{games.su_dung ? 'Sử dụng' : 'Ẩn'}</span></td>
                                                    <td className='text-center'><span className={games.is_new ? 'badge bg-success' : ''}>{games.is_new ? 'New' : ''}</span></td>
                                                    <td className='text-center'><span className={games.is_trending ? 'badge bg-success' : ''}>{games.is_trending ? 'Trending' : ''}</span></td>
                                                    <td>
                                                        <Link to={`form/${games.id}`} title="Xem chi tiết" className="btn bg-gradient-info btn-xs">
                                                            <i className="fas fa-binoculars"></i>
                                                        </Link>
                                                        <button type="button" title="Xóa" onClick={() => handleShow(games.id)} className="btn bg-gradient-danger btn-xs" data-toggle="modal" data-target="#modal-default">
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
                                        url={'games'}
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
                <ModalCrawlGames 
                    handleClose={handleCloseCrawlGames}
                    title='Crawl games'
                    show={showModalCrawlGames}
                    confirmFn={(obj: any) => handleCrawlGames(obj)}
                    // watch={watch}
                />
            </section>
        </div>

    )
}