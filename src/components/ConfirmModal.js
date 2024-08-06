// // ConfirmModal.jsx
// import React from 'react';
// import '../css/ConfirmModal.css';

// const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Confirm Action</h2>
//         <p>{message}</p>
//         <div className="modal-actions">
//           <button onClick={onConfirm}>Confirm</button>
//           <button onClick={onCancel}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;


// ConfirmModal.jsx
import React from 'react';
import '../css/ConfirmModal.css';

const ConfirmModal = ({ isOpen, message, reason, onReasonChange, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Enter reason for deactivation"
          className="reason-textarea"
        />
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
