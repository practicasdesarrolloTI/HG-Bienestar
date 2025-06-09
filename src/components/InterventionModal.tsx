import React from "react";
import "../styles/InterventionModal.css";
import { Intervencion } from "../types/Intervenciones.type";
import { format, parseISO } from "date-fns";
import { cerrarCasoIntervenciones } from "../services/interventionService";
import { toast } from "react-toastify";

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  defaultText?: string;
  intervencionesAnteriores: Intervencion[];
  onRefresh: () => void;
  text: string;
  setText: (text: string) => void;
}

const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  intervencionesAnteriores,
  onRefresh,
  text, setText
}) => {

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Por favor ingrese el detalle de la intervención.");
      return;
    }
    onSave(text);
    setText("");
    onClose();
    onRefresh();
  };

  if (!isOpen) return null;

  const handleCerrarIntervencion = async () => {
    if (intervencionesAnteriores.length === 0 && !text.trim()) {
      toast.error("Debe ingresar al menos una intervención para cerrar el caso.");
      return;
    }

    if (window.confirm("¿Estás seguro de cerrar este caso? Esto cerrará TODAS las intervenciones de este paciente.")) {
      try {
        // 1️⃣ Guardar la intervención actual (si hay texto)
        if (text.trim()) {
          onSave(text);
        }

        // 2️⃣ Cerrar TODAS las intervenciones de este paciente
        const pacienteTipo = intervencionesAnteriores[0]?.pacienteTipo || ""; // o del selectedPatient
        const pacienteNumero = intervencionesAnteriores[0]?.pacienteNumero || "";

        if (!pacienteTipo || !pacienteNumero) {
          toast.error("Error: no se pudo obtener el paciente.");
          return;
        }

        await cerrarCasoIntervenciones(pacienteTipo, pacienteNumero);

        toast.success("Caso cerrado correctamente.");

        setText("");
        onClose();
        onRefresh();

      } catch  {
        toast.error("Error al cerrar el caso.");
      }
    }
  };


  const ultimaCerrada = intervencionesAnteriores.some(i => i.cerrada);

  console.log("Intervenciones cerradas:", ultimaCerrada);

  return (
    <div className="intervention-modal-backdrop">
      <div className="intervention-modal">
        <h4>Intervenciones anteriores:</h4>
        {intervencionesAnteriores.length === 0 ? (
          <p>No hay intervenciones previas para este paciente.</p>
        ) : (
          <ul>
            {intervencionesAnteriores.map((interv, index) => (
              <li key={index}>
                <strong>{format(parseISO(interv.fechaIntervencion), "dd/MM/yyyy HH:mm")}</strong>: {interv.detalles} (por {interv.realizadaPor})
                {" "}
                {interv.cerrada ? "✅ Cerrada" : "🔓 Abierta"}
              </li>
            ))}
          </ul>
        )}

        <h2>Registrar Intervención</h2>

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

          {!ultimaCerrada && intervencionesAnteriores.length > 0 && (
            <button
              onClick={handleCerrarIntervencion}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#00C853",
                color: "white",
                cursor: "pointer"
              }}
            >
              Cerrar intervención
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default InterventionModal;
