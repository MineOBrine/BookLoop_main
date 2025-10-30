// src/Components/NotificationModal.jsx
import React from "react";
import "../assets/notificationModal.css";

export default function NotificationModal({
  show,
  onClose,
  message = "",
  type = "info", // success | error | info
}) {
  if (!show) return null;

  const getTitle = () => {
    switch (type) {
      case "error":
        return "❌ Error";
      case "success":
        return "✅ Success";
      case "info":
      default:
        return "ℹ️ Info";
    }
  };

  const getClassName = () => {
    switch (type) {
      case "error":
        return "modal-error";
      case "success":
        return "modal-success";
      case "info":
      default:
        return "modal-info";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${getClassName()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{getTitle()}</h3>
        <p>{message}</p>
        <button onClick={onClose} className="modal-btn">
          OK
        </button>
      </div>
    </div>
  );
}
