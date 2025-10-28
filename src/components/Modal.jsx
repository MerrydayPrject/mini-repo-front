import '../styles/Modal.css'

const Modal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                </div>
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal

