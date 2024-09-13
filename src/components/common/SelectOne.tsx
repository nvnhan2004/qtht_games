import { Fragment, SelectHTMLAttributes, useEffect, useState } from 'react'


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    data: any[],
    className: string,
    onChange?: any,
    onAction?: any,
    watch?: any,
    value?: any,
    register?: any,
    name?: any,
    rules?: any,
    size?: any,
    required?: boolean
    placeholder?: string
}

export default function SelectOne (props: SelectProps){
    const { className, data, onAction, watch, value, onChange, register, name, rules, size, placeholder, required = false, ...rest} = props
    const [dataList, setDataList] = useState(data);
    let watchMysel: unknown
    if(watch){
        watchMysel = watch(name)
    }
    useEffect(() => {
        
        setDataList(data);
    }, [data]);

    useEffect(() => {
        onChange(watchMysel)
    }, [watchMysel]);

    return(
        <select size={size || 'md'} name={name} value={value} className='form-control' {...register(name, rules)} >
            {!required &&
            <option value="">{placeholder ? placeholder : 'Chọn ...'}</option>
            }
            {dataList.map((item: any) => (
                <option key={item.value} selected={value} value={item.value}>{item.label}</option>
            ))}
        </select>
    )
}
