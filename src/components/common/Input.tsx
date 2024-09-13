import type { 
    // RegisterOptions, 
    UseFormRegister 
} from 'react-hook-form'
import TextErrorMessage from './TextErrorMessage'
import { Fragment, useEffect, useState } from 'react'
import { formatMoneyShow } from '../../utils/utils'

interface Props{
    className?: string
    id?: string
    type: React.HTMLInputTypeAttribute
    placeholder?: string
    register: UseFormRegister<any>
    rules?: any
    name: string
    autoComplete?: string
    value?: any
    onChange?: any
    disabled?: boolean
    radix?: string
    type_custom?: string
}

export default function Input({className, id, type, placeholder, register, name, rules, autoComplete, value, onChange, disabled, radix, type_custom} : Props){
    const [val, setVal] = useState(value);
    useEffect(() => {
        let valNew = ''
        if(type_custom === 'number'){
            let valll = value.toString().replaceAll(radix ?? '', '')
            valNew = formatMoneyShow(valll, radix ?? '')
            console.log(valNew);
        }
        
        setVal(valNew || value);
    }, [value]);

    return (
        <Fragment>
            <input 
                type={type}
                className={className}
                placeholder={placeholder}
                {...register(name, rules)} 
                autoComplete={autoComplete}
                value={val}
                onChange={onChange}
                disabled={disabled}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            />
        </Fragment>
    )
}