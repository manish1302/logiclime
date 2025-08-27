import React from 'react'

const CustomModal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null;

  return (
    <div className={`modal-overlay`}>
      <div className={`modal-container ${className}`}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default CustomModal

