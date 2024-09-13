import { SelectHTMLAttributes, useEffect, useState } from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import { flattenTree, setValue } from '../../utils/utils';

type Mode = 'multiSelect' | 'simpleSelect' | 'radioSelect' | 'hierarchical';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  data: any[],
  className: string,
  texts?: any,
  mode?: Mode,
  onChange?: any,
  onAction?: any,
  onNodeToggle?: any,
  handleChange?: any,
  value?: any
}

export default function SelectNvn(props: SelectProps){
    const { className, data, texts, mode, onAction, onNodeToggle, handleChange, value, ...rest} = props
    const [dataTree, setDataTree] = useState(data);
    const { dataMap, map } = flattenTree(JSON.parse(JSON.stringify(props.data || [])));
    
    useEffect(() => {
        setDataTree(data);
    }, [data]);

    useEffect(() => {
        setValue(value,map,mode,true);
        setDataTree(dataMap);
        
    }, [value]);

    const onChange = (currentNode: any, selectedNodes: any) => {
        handleChange(selectedNodes)
    }

    return(
        <DropdownTreeSelect  
            data={dataTree || []} 
            className={className}
            texts={{placeholder: 'Chọn ...'}}
            mode={mode}
            keepTreeOnSearch={true}
            keepChildrenOnSearch={true}
            onChange={onChange} 
            onAction={onAction} 
            onNodeToggle={onNodeToggle}
        />
    )
}