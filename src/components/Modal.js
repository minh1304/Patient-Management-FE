import React from 'react';
import ReactDOM from 'react-dom';
import '../css/Modal.css';

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay-confirm" onClick={onClose}>
      <div className="modal-content-confirm" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
