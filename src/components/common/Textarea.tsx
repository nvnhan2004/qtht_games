import type { 
    UseFormRegister 
} from 'react-hook-form'
import { Fragment, useEffect, useState } from 'react'

interface Props{
    className?: string
    placeholder?: string
    register: UseFormRegister<any>
    rules?: any
    name: string
    value?: any
    onChange?: any
    disabled?: boolean
    rows?: number
}

export default function Textarea({className, placeholder, register, name, rules, value, onChange, disabled, rows} : Props){
    const [val, setVal] = useState(value);
    useEffect(() => {
        setVal(value);
    }, [value]);

    return (
        <Fragment>
            <textarea 
                rows={rows}
                className={className}
                placeholder={placeholder}
                value={val}
                {...register(name, rules)} 
                onChange={onChange}
                disabled={disabled}
            ></textarea>
        </Fragment>
    )
}