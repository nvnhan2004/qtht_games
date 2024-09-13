import { ButtonHTMLAttributes } from 'react'
import { Form, Col, Button, Modal } from 'react-bootstrap';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    show?: boolean,
    message?: string,
    handleClose: () => void,
    title: string,
    confirmFn?: () => void,
    icon?: string,
    size?: 'sm' | 'lg' | 'xl'
}

export default function ModalCustom(props: ButtonProps){
    const { show, title, message, handleClose, confirmFn, icon, size, ...rest} = props

    return(
        <Modal size={size} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><i className={icon ? icon : "fas fa-exclamation-triangle text-warning"}></i> {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className='btn-sm' onClick={handleClose}>
                <i className="fas fa-times"></i> Đóng
                </Button>
                <Button variant="primary" className='btn-sm' onClick={confirmFn}>
                <i className="fas fa-check"></i> Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    )
}