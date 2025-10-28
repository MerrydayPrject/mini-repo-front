import '../styles/Modal.css'

const Modal = ({ isOpen, onClose, title, message, children, center = false }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {title ? (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                    </div>
                ) : null}
                <div className={`modal-body${center ? ' center' : ''}`}>
                    <p className="modal-message">{message}</p>
                    {children}
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

