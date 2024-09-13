
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
import dieuHuongApi from '../../../apis/dieuHuong.api'

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
    getNhomNguoiDungById?: any,
    id: string | undefined,
    ds_dieuhuong: []
}

export default function PhanQuyen(props: PropsDanhSachNguoiDung) {
    const {getNhomNguoiDungById, id, ds_dieuhuong} = props
    
    const [dataDH, setDataDH] = useState<any[]>([]);
    const [ltsIdCheckbox, setLtsIdCheckbox] = useState<string[]>([]);
    let metaClone = _.cloneDeep(metaObj)
    metaClone.page_size = 0
    metaClone.sort = {stt_order: 1}
    metaClone.filter = {
        nnd_id: id
    }
    const [meta, setMeta] = useState(metaClone);
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

    const { data } = useQuery({
        queryKey: ['dieuHuong-phanQuyen', meta],
        queryFn: () => dieuHuongApi.getMany(meta),
    })

    useEffect(() => {
        let ltsIdPermission = ds_dieuhuong.map((x: any) => {
            return x.id
        })
        setLtsIdCheckbox(ltsIdPermission)
    }, [ds_dieuhuong])

    useEffect(() => {
        setDataDH(data?.data.data || [])
    }, [data])

    const handleSelectAll = (e: any) => {
        if (!e.checked){
            setLtsIdCheckbox([]);
            dataDH.forEach((user: any) => setValue(`checkbox_${user.id}`, false));
        }
    }

    const handleSelectedItem = (e: any, dh: any) => {
        if (e.checked){
            let ltsIdParent = dh.muc_luc.split('\\')
            
            dataDH.forEach((t: any) => {
                if([...ltsIdCheckbox, ...ltsIdParent].includes(t.id)){
                    setValue(`checkbox_${t.id}`, true)
                }
            });
            setLtsIdCheckbox([...ltsIdCheckbox, ...ltsIdParent]);
            
        }
        else{
            setValue("all", false);
            let ltsIdUnCheck = dataDH.map((x: any) => {
                if(x.muc_luc.startsWith(dh.muc_luc))
                    return x.id
            }).filter(x => x !== undefined)

            let ltsIdNew = ltsIdCheckbox.filter(x => !ltsIdUnCheck.includes(x))
            dataDH.forEach((t: any) => {
                if(ltsIdNew.includes(t.id)){
                    setValue(`checkbox_${t.id}`, true)
                }
                else
                setValue(`checkbox_${t.id}`, false)
            });
            setLtsIdCheckbox(ltsIdNew);
        }
    }

    useEffect(() => {
        if(ltsIdCheckbox.length === dataDH.length){
            setValue("all", true);
        }
    }, [ltsIdCheckbox])

    useEffect(() => {
        if (watch("all")) {
            let ltsId : string[]= [];
            dataDH.forEach((user: any) => {
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

    const handleToggle = (item: any) => {
        let itemClone = JSON.parse(JSON.stringify(item))
        let flag = {
            muc_luc: '',
            is_show: null
        }
        let dataUpdateDH = dataDH.map((x: any) => {
            if(x.id == itemClone.id){
                x.is_show = !itemClone.is_show
            }
            if(x.muc_luc.startsWith(itemClone.muc_luc) && x.muc_luc != itemClone.muc_luc){
                // nếu item đang mở -> đóng
                if (itemClone.is_show)
                    x.is_disabled = true // đóng hết toàn bộ con
                // nếu item đang đóng -> mở
                else{
                    // check cấp liền kề
                    if(x.cap_dieu_huong - itemClone.cap_dieu_huong == 1){
                        x.is_disabled = false // mở hết con liền kề

                        // 
                        if(x.is_dady){
                            flag = {
                                muc_luc: x.muc_luc,
                                is_show: x.is_show
                            }
                        }
                    }
                    // check cấp sâu hơn
                    else{
                        if (x.muc_luc.startsWith(flag.muc_luc)){
                            if (flag.is_show){
                                x.is_disabled = false
                            }
                            else{
                                x.is_disabled = true
                            }

                            // nếu gặp is_dady tiếp theo
                            if(x.is_dady){
                                flag = {
                                    muc_luc: flag.muc_luc, // vẫn dùng mục lục cha
                                    // nếu thằng cha đầu tiên đang đóng thì vẫn duy trì trạng thái đóng
                                    is_show: !flag.is_show ? flag.is_show : x.is_show
                                }
                            }
                        }
                    }
                }
            }
            return x;
        })
        
        setDataDH(dataUpdateDH)
    }

    const addPermissionMutation = useMutation({
        mutationFn: (obj: any) => nhomNguoiDungApi.addPermission(obj)
    })

    const handlerPermission = () => {
        let obj = {
            nhom_id: id,
            lts_dieu_huong_id: [...new Set(ltsIdCheckbox)]
        }

        addPermissionMutation.mutate(obj, {
            onSuccess: (_: any) => {
                getNhomNguoiDungById()
                toast.success('Chỉnh sửa quyền cho nhóm thành công!')
            },
            onError: (error) => {
                toast.error(error?.message)
            }
        })
    }

    return(
        <div className="col-xs-12 col-md-12">
            <div className="card" style={{backgroundColor: '#f3f9ff'}}>
                <div className="card-header">
                    <h3 className="card-title">Phân quyền</h3>
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus" />
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="">
                        <div className="mt-1 mb-4 d-flex">
                            <div className="col-xs-12 col-md-12 text-right">
                                <button type="button" title="Xóa" className="btn bg-gradient-primary btn-sm" onClick={handlerPermission} data-toggle="modal" data-target="#modal-default">
                                    <i className="far fa-save"></i> Lưu
                                </button>
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
                                        <th>Tên</th>
                                        <th style={{width: '30%'}}>Mô tả</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dataDH.map((dieuHuong: any) => (
                                        <>
                                            {!dieuHuong.is_disabled &&
                                            <tr key={dieuHuong.id}>
                                                <td>
                                                    {/* {dieuHuong.is_dady && dieuHuong.is_show &&
                                                    <i className="fas fa-minus" onClick={() => handleToggle(dieuHuong)}></i>
                                                    }
                                                    {dieuHuong.is_dady && !dieuHuong.is_show &&
                                                    <i className="fas fa-plus" onClick={() => handleToggle(dieuHuong)}></i>
                                                    } */}
                                                </td>
                                                <td>
                                                    <div className="icheck-primary d-inline">
                                                        <div>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={ltsIdCheckbox.includes(dieuHuong.id)}
                                                                {...register(`checkbox_${dieuHuong.id}`)}
                                                                name={`checkbox_${dieuHuong.id}`}
                                                                onClick={(e) => handleSelectedItem(e.target, dieuHuong)}    
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`p-ll-${(dieuHuong.cap_dieu_huong - 1) * 2}`}>
                                                    {dieuHuong.is_dady && dieuHuong.is_show &&
                                                    <i className="fas fa-minus pr-2" onClick={() => handleToggle(dieuHuong)}></i>
                                                    }
                                                    {dieuHuong.is_dady && !dieuHuong.is_show &&
                                                    <i className="fas fa-plus pr-2" onClick={() => handleToggle(dieuHuong)}></i>
                                                    }
                                                    {dieuHuong.ten}
                                                </td>
                                                <td style={{display: "table-cell"}}>{dieuHuong.mo_ta}</td>
                                            </tr>
                                            }
                                        </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}