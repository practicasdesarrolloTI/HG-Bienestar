import React, { useState } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import "../styles/MedicationsTable.css";
import data from "../data/MedData";
import InterventionModal from "../components/InterventionModal";
import { MedData } from "../types/Medications.type";
import EmptyMessage from "../components/EmptyMessage";

const MedicationsTable: React.FC = () => {
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [intervencionFiltro, setIntervencionFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MedData | null>(null);
  const [busquedaDocumento, setBusquedaDocumento] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData = data.filter((row) => {
    const fecha = parseISO(row.fecha);
    return (
      (tipoFiltro === "" || row.tipoIdentificacion === tipoFiltro) &&
      (intervencionFiltro === "" ||
        (intervencionFiltro === "si" && row.requiereIntervencion) ||
        (intervencionFiltro === "no" && !row.requiereIntervencion)) &&
      (!fechaInicio ||
        !fechaFin ||
        isWithinInterval(fecha, { start: fechaInicio, end: fechaFin })) &&
      (busquedaDocumento === "" ||
        row.identificacion
          .toLowerCase()
          .includes(busquedaDocumento.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        "Tipo ID": row.tipoIdentificacion,
        Documento: row.identificacion,
        Nombre: row.nombre,
        Teléfono: row.telefono,
        Reporte: row.reporte,
        Fecha: format(parseISO(row.fecha), "dd/MM/yyyy"),
        "Requiere Intervención": row.requiereIntervencion ? "Sí" : "No",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medicamentos");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "medicamentos.xlsx");
  };

  return (
    <div className="med-container">
      <h2>Gestión Medicamentos</h2>
      <div className="info-container">
        <div className="filters-card">
          <div className="filter-row">
            <label>
              Tipo de docuemnto:
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
              </select>
            </label>

            <label>
              Fecha Inicial:
              <DatePicker
                selected={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                dateFormat="dd/MM/yyyy"
                className="datepicker-input"
              />
            </label>

            <label>
              Fecha Final:
              <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                dateFormat="dd/MM/yyyy"
                className="datepicker-input"
              />
            </label>

            <label>
              Requiere Intervención:
              <select
                value={intervencionFiltro}
                onChange={(e) => setIntervencionFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>
        </div>

        {/* Tabla */}
        <div className="export-buttons">
          <button
            onClick={exportToExcel}
            disabled={filteredData.length === 0}
            className={filteredData.length === 0 ? "disabled-btn" : ""}
          >
            Exportar Excel
          </button>
          <input
            type="text"
            placeholder="Buscar por documento..."
            value={busquedaDocumento}
            onChange={(e) => setBusquedaDocumento(e.target.value)}
            className="search-input"
          />
        </div>
        {filteredData.length > 0 ? (
          <div className="info-card">
            <table className="survey-table">
              <thead>
                <tr>
                  <th>Tipo de documento</th>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Reporte</th>
                  <th>Fecha</th>
                  <th>Intervención</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, i) => (
                  <tr key={i}>
                    <td>{row.tipoIdentificacion}</td>
                    <td>{row.identificacion}</td>
                    <td>{row.nombre}</td>
                    <td>{row.telefono}</td>
                    <td>{row.reporte}</td>
                    <td>{format(parseISO(row.fecha), "dd/MM/yyyy")}</td>
                    <td style={{ textAlign: "center" }}>
                      {row.requiereIntervencion ? (
                        <button
                          onClick={() => {
                            setSelectedRow(row);
                            setIsModalOpen(true);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                          title="Registrar intervención"
                        >
                          <FaExclamationTriangle
                            style={{ color: "#FF5F3F", fontSize: "1.2rem" }}
                          />
                        </button>
                      ) : (
                        <FaCheckCircle
                          style={{ color: "#00B094", fontSize: "1.2rem" }}
                          title="Sin intervención"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                « Anterior
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente »
              </button>
            </div>
          </div>
        ) : (
          <EmptyMessage message="No se encontraron datos en tu búsqueda." />
        )}
      </div>
      <InterventionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(text) => {
          console.log("Paciente:", selectedRow?.identificacion);
          console.log("Intervención guardada:", text);
          // Aquí puedes enviar `text` al backend si es necesario
        }}
      />
    </div>
  );
};

export default MedicationsTable;
