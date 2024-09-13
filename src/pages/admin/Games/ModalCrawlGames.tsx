import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { Form, Col, Button, Modal, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import SelectNvn from '../../../components/common/Select';
import categoriesApi from '../../../apis/categories.api';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    show?: boolean,
    handleClose: () => void,
    confirmFn: (formState: any) => void,
    // watch?: any
}

interface FormData{
    // link: string
    category_id: string | null
}

const initialFormState: FormData = {
    // link: '',
    category_id: ''
}

export default function ModalCrawlGames(props: ButtonProps){
    const { show, title, handleClose, confirmFn, ...rest} = props
    const [dataTree, setDataTree] = useState([]);

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

    const { data: fetchedData } = useQuery({
        queryKey: ['treeCategoriesForm'],
        queryFn: () => categoriesApi.treeCategoriesForm()
    });

    useEffect(() => {
        if (fetchedData) {
            setDataTree(fetchedData?.data);
        }
    }, [fetchedData]);

    useEffect(() => {
        setFormState({
            ...formState,
            category_id: null,
        })
    }, [show])

    // const handleChange = (name: 'link') => (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormState((prev: any) => ({ ...prev, [name]: event.target.value }))
    // }
    
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

    return(
        <Modal size='xl' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><i className="fas fa-gamepad text-success"></i> {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group col-md-12">
                            <label htmlFor="category_id">Categories</label>
                            <React.Fragment>
                                <SelectNvn 
                                    data={dataTree || []} 
                                    className='select_tree'
                                    // mode="simpleSelect"
                                    mode="radioSelect"
                                    handleChange={(selectedNodes: any[]) => handleChangeSelect(selectedNodes)} 
                                    value={formState.category_id}
                                />
                            </React.Fragment>
                        </div>

                        {/* <div className="form-group col-md-12">
                            <label htmlFor="link">Link crawl</label>
                            <React.Fragment>
                                <Input 
                                    className="form-control"
                                    id="link"
                                    type="text"
                                    register={register}
                                    name="link"
                                    placeholder="Nhập link crawl"
                                    value={formState.link}
                                    onChange={handleChange('link')}
                                />
                            </React.Fragment>
                        </div> */}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className='btn-sm' onClick={handleClose}>
                <i className="fas fa-times"></i> Đóng
                </Button>
                <Button variant="primary" className='btn-sm' onClick={() => confirmFn(formState)}>
                <i className="fas fa-check"></i> Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    )
}