import { Fragment, SelectHTMLAttributes, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    onChangee?: any,
    watch?: any,
    value?: any,
    register?: any,
    name?: any,
    rules?: any,
    placeholder?: string,
    clearErrors?: any,
    control?: any,
    className?: string,
}

export default function Datetime (props: SelectProps){
    const { className, watch, value, onChangee, register, name, rules, placeholder, clearErrors, control, ...rest} = props
    const [val, setVal] = useState(value);
    // const watchMysel = watch(name)
    useEffect(() => {
        setVal(value);
    }, [value]);

    // useEffect(() => {
    //     onChange(watchMysel)
    // }, [watchMysel]);

    // const onChange = (date: any, dateString: any) => {
    //     console.log(date);
        
    //     onChangee(date)
    // }

    return(
        <div className="form-control date-picker px-0 pt-0 pb-0">
            <Controller
                control={control}
                name={name}
                rules={rules}
                defaultValue={val}
                render={({ field: { onChange, onBlur, value, ref, name } }) => 
                (
                    <div className={className}>
                        <div className="form-control date-picker px-0 pt-0 pb-0">
                            <DatePicker 
                                selected={value} 
                                dateFormat="dd/MM/yyyy"
                                name={name}
                                placeholderText={placeholder}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onChange={(date) => {onChange(date); onChangee(date)}}
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    )
}