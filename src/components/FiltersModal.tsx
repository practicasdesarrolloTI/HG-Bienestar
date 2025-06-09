// src/components/FiltersModal.tsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FiltersModal.css"; // Puede contener solo estilos de este modal

type FiltersModalProps = {
  show: boolean;
  onClose: () => void;
  onApply: () => void;
  onClearAll: () => void;

  // Estados y setters para cada filtro (arrays para multi-selección)
  selectedTipos: string[];
  setSelectedTipos: React.Dispatch<React.SetStateAction<string[]>>;

  selectedFindriscCats: string[];
  setSelectedFindriscCats: React.Dispatch<React.SetStateAction<string[]>>;

  selectedFraminghamCats: string[];
  setSelectedFraminghamCats: React.Dispatch<React.SetStateAction<string[]>>;

  selectedLawtonCats: string[];
  setSelectedLawtonCats: React.Dispatch<React.SetStateAction<string[]>>;

  selectedMoriskyCats: string[];
  setSelectedMoriskyCats: React.Dispatch<React.SetStateAction<string[]>>;

  fechaInicio: Date | null;
  setFechaInicio: React.Dispatch<React.SetStateAction<Date | null>>;

  fechaFin: Date | null;
  setFechaFin: React.Dispatch<React.SetStateAction<Date | null>>;

  selectedIntervencion: string[];
  setSelectedIntervencion: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FiltersModal: React.FC<FiltersModalProps> = ({
  show,
  onClose,
  onApply,
  onClearAll,
  selectedTipos,
  setSelectedTipos,
  selectedFindriscCats,
  setSelectedFindriscCats,
  selectedFraminghamCats,
  setSelectedFraminghamCats,
  selectedLawtonCats,
  setSelectedLawtonCats,
  selectedMoriskyCats,
  setSelectedMoriskyCats,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  selectedIntervencion,
  setSelectedIntervencion,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Filtros</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Tipo de documento */}
          <div className="filter-group">
            <p className="filter-title">Tipo de documento:</p>
            {["CC", "TI", "CE"].map((tipo) => (
              <label key={tipo} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value={tipo}
                  checked={selectedTipos.includes(tipo)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTipos((prev) =>
                      prev.includes(val)
                        ? prev.filter((x) => x !== val)
                        : [...prev, val]
                    );
                  }}
                />
                {tipo}
              </label>
            ))}
          </div>

          {/* Encuestas y categorías */}
          <div className="filter-group">
            <p className="filter-title">Encuestas:</p>

            <details>
              <summary>FINDRISC</summary>
              {["Bajo", "Aumentado", "Moderado", "Alto", "Muy Alto", "Sin dato"].map(
                (cat) => (
                  <label key={`fr-${cat}`} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={selectedFindriscCats.includes(cat)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedFindriscCats((prev) =>
                          prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                        );
                      }}
                    />
                    {cat}
                  </label>
                )
              )}
            </details>

            <details>
              <summary>Framingham</summary>
              {["Bajo", "Moderado", "Alto", "Sin dato"].map((cat) => (
                <label key={`fm-${cat}`} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedFraminghamCats.includes(cat)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFraminghamCats((prev) =>
                        prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                      );
                    }}
                  />
                  {cat}
                </label>
              ))}
            </details>

            <details>
              <summary>Lawton-Brody</summary>
              {[
                "Independiente",
                "Dependencia Leve",
                "Dependencia Moderada",
                "Dependencia Total",
                "Sin dato",
              ].map((cat) => (
                <label key={`lw-${cat}`} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedLawtonCats.includes(cat)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedLawtonCats((prev) =>
                        prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                      );
                    }}
                  />
                  {cat}
                </label>
              ))}
            </details>

            <details>
              <summary>Morisky-Green</summary>
              {["Bajo", "Alto", "Sin dato"].map((cat) => (
                <label key={`mg-${cat}`} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedMoriskyCats.includes(cat)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedMoriskyCats((prev) =>
                        prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                      );
                    }}
                  />
                  {cat}
                </label>
              ))}
            </details>
          </div>

          {/* Rango de fechas */}
          <div className="filter-group">
            <p className="filter-title">Fecha:</p>
            <label className="filter-checkbox-label">
              Desde:
              <DatePicker
                selected={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                dateFormat="dd/MM/yyyy"
                className="datepicker-input"
              />
            </label>
            <label className="filter-checkbox-label">
              Hasta:
              <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                dateFormat="dd/MM/yyyy"
                className="datepicker-input"
              />
            </label>
          </div>

          {/* Intervención */}
          <div className="filter-group">
            <p className="filter-title">Intervención:</p>
            {["Sí", "No"].map((opt) => (
              <label key={`int-${opt}`} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  value={opt}
                  checked={selectedIntervencion.includes(opt)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedIntervencion((prev) =>
                      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                    );
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClearAll} className="btn btn-outline">
            Limpiar todo
          </button>
          <button onClick={onApply} className="btn btn-primary">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
