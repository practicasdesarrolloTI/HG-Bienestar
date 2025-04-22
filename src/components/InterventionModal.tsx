import React, { useState } from "react";
import "../styles/InterventionModal.css";

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  defaultText?: string;
}

const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultText = "",
}) => {
  const [text, setText] = useState(defaultText);

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="intervention-modal-backdrop">
      <div className="intervention-modal">
        <h3>Registrar Intervención</h3>
        <textarea
          placeholder="Escribe aquí la intervención realizada..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />


          <div className="modal-buttons">
            <button onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
            <button onClick={handleSave} className="save-btn">
              Guardar
            </button>
          </div>
        </div>
      </div>
  );
};

export default InterventionModal;
