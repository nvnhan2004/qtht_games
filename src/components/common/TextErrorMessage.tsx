interface Props {
    message?: string
}

export default function TextErrorMessage({message}: Props){
    return(
        <div style={{width: '100%', height: '23.5px'}}>
            <p className="mt-1 mb-0" style={{fontSize: '13px', color: 'red'}}>
            {message}
            </p>
        </div>
    )
}