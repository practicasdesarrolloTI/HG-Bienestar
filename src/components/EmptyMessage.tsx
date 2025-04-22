import React from "react";
import "../styles/EmptyMessage.css";
import { FaSearch } from "react-icons/fa";


interface EmptyMessageProps {
  message: string;
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({ message }) => {
  return (
    <div className="empty-message">
      <FaSearch className="empty-icon" />
      <p>{message}</p>
    </div>
  );
};

export default EmptyMessage;
