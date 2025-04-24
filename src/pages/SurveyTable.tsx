import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  parseISO,
  isWithinInterval,
  differenceInMonths,
} from "date-fns";
import "../styles/SurveyTable.css";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getSurveyResults } from "../services/surveyResultService";
import { SurveyResult, Agrupado } from "../types/Survey.type";
import "../styles/colors.css";
import ClipLoader from "react-spinners/ClipLoader";
import EmptyMessage from "../components/EmptyMessage";
import InterventionModal from "../components/InterventionModal";
import ErrorComponent from "../components/ErrorComponent";

const agruparPorPacienteYPeriodo = (datos: SurveyResult[]): Agrupado[] => {
  const grupos: Agrupado[] = [];

  datos.forEach((encuesta) => {
    const fechaActual = parseISO(encuesta.fecha);

    // Buscar si ya hay un grupo para este paciente en un rango menor a 6 meses
    const grupoExistente = grupos.find(
      (g) =>
        g.identificacion === encuesta.identificacion &&
        g.tipoIdentificacion === encuesta.tipoIdentificacion &&
        differenceInMonths(fechaActual, parseISO(g.fecha)) <= 6
    );

    if (grupoExistente) {
      // Actualizar el grupo con el puntaje correspondiente
      if (encuesta.findrisc !== null)
        grupoExistente.findrisc = encuesta.findrisc;
      if (encuesta.framingham !== null)
        grupoExistente.framingham = encuesta.framingham;
      if (encuesta.lawtonBrody !== null)
        grupoExistente.lawtonBrody = encuesta.lawtonBrody;

      // Si esta fecha es más reciente, actualiza la fecha principal del grupo
      if (fechaActual > parseISO(grupoExistente.fecha)) {
        grupoExistente.fecha = encuesta.fecha;
      }
    } else {
      // Si no existe, crear uno nuevo
      grupos.push({
        tipoIdentificacion: encuesta.tipoIdentificacion,
        identificacion: encuesta.identificacion,
        nombre: encuesta.nombre,
        fecha: encuesta.fecha,
        findrisc: encuesta.findrisc,
        framingham: encuesta.framingham,
        lawtonBrody: encuesta.lawtonBrody,
      });
    }
  });

  return grupos;
};

const getFindriscCategoria = (value: number | null): string => {
  if (value === null) return "Sin dato";
  if (value <= 6) return "Bajo";
  if (value <= 11) return "Aumentado";
  if (value <= 14) return "Moderado";
  if (value <= 20) return "Alto";
  return "Muy Alto";
};

const getFraminghamCategoria = (value: number | null): string => {
  if (value === null) return "Sin dato";
  if (value < 5) return "Bajo";
  if (value <= 10) return "Moderado";
  return "Alto";
};

const getLawtonCategoria = (value: number | null): string => {
  if (value === null) return "Sin dato";
  if (value <= 2) return "Dependencia Total";
  if (value <= 4) return "Dependencia Moderada";
  if (value <= 6) return "Dependencia Leve";
  return "Independiente";
};

const necesitaIntervencion = (row: SurveyResult | Agrupado): boolean => {
  const fr = getFindriscCategoria(row.findrisc);
  const fm = getFraminghamCategoria(row.framingham);
  const lb = getLawtonCategoria(row.lawtonBrody);

  return (
    fr === "Alto" ||
    fr === "Muy Alto" ||
    fm === "Alto" ||
    lb === "Dependencia Total" ||
    lb === "Dependencia Moderada"
  );
};

const SurveyTable: React.FC = () => {
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [escalaSeleccionada, setEscalaSeleccionada] = useState("");
  const [findriscFiltro, setFindriscFiltro] = useState("");
  const [framinghamFiltro, setFraminghamFiltro] = useState("");
  const [lawtonFiltro, setLawtonFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [intervencionFiltro, setIntervencionFiltro] = useState("");
  const [data, setData] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SurveyResult | null>(
    null
  );
  const [busquedaDocumento, setBusquedaDocumento] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(
    null
  );

  const datosAgrupados = agruparPorPacienteYPeriodo(data);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const cargarDatos = () => {
      setLoading(true);
      setError(null);

      getSurveyResults()
        .then((res) => {
          setData(res);
          setUltimaActualizacion(new Date());
          console.log("📊 Datos actualizados:", res);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error actualizando encuestas:", err);
          setError("No se pudo cargar la información.");
          setLoading(false);
        });
    };

    cargarDatos(); // primera carga inmediata

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 600000); // 10 minutos

    return () => clearInterval(intervalo);
  }, []);

  const filteredData = datosAgrupados.filter((row) => {
    const fechaEncuesta = parseISO(row.fecha);

    return (
      (tipoFiltro === "" || row.tipoIdentificacion === tipoFiltro) &&
      (escalaSeleccionada === "findrisc"
        ? findriscFiltro === "" ||
          getFindriscCategoria(row.findrisc) === findriscFiltro
        : true) &&
      (escalaSeleccionada === "framingham"
        ? framinghamFiltro === "" ||
          getFraminghamCategoria(row.framingham) === framinghamFiltro
        : true) &&
      (escalaSeleccionada === "lawton"
        ? lawtonFiltro === "" ||
          getLawtonCategoria(row.lawtonBrody) === lawtonFiltro
        : true) &&
      (!fechaInicio ||
        !fechaFin ||
        isWithinInterval(fechaEncuesta, {
          start: fechaInicio,
          end: fechaFin,
        })) &&
      (intervencionFiltro === "" ||
        (intervencionFiltro === "si" && necesitaIntervencion(row)) ||
        (intervencionFiltro === "no" && !necesitaIntervencion(row))) &&
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
    const hoy = new Date();
    const nombreArchivo = `encuestas_${format(hoy, "yyyyMMdd_HHmm")}.xlsx`;

    // Resumen inicial
    const resumen = [
      { Resumen: `Total pacientes: ${filteredData.length}` },
      {},
    ];

    // Datos de encuesta
    const datos = filteredData.map((row) => ({
      "Tipo ID": row.tipoIdentificacion,
      ID: row.identificacion,
      Nombre: row.nombre,
      FINDRISC: row.findrisc ?? "-",
      Framingham: row.framingham ?? "-",
      LawtonBrody: row.lawtonBrody ?? "-",
      Fecha: format(parseISO(row.fecha), "dd/MM/yyyy"),
      Intervención: necesitaIntervencion(row) ? "Sí" : "No",
    }));

    // Combina resumen y datos
    const hoja = XLSX.utils.json_to_sheet([...resumen, ...datos], {
      skipHeader: false,
    });

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Encuestas");

    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      nombreArchivo
    );
  };

  if (loading) {
    return (
      <div
        className="loading"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <ClipLoader color="#00B094" loading={loading} size={50} />
        <p style={{ marginTop: "10px" }}>Cargando encuestas...</p>
      </div>
    );
  }

  if (error) {
    return (  
        <ErrorComponent message={error || 'Error al cargar la información'} />
    );
  }

  const getFindriscColorClass = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "riesgo-sin-dato";
    if (value <= 6) return "riesgo-bajo";
    if (value <= 11) return "riesgo-aumentado";
    if (value <= 14) return "riesgo-moderado";
    if (value <= 20) return "riesgo-alto";
    return "riesgo-muy-alto";
  };

  const getFraminghamColorClass = (
    value: number | null | undefined
  ): string => {
    if (value === null || value === undefined) return "riesgo-sin-dato";
    if (value <= 10) return "riesgo-bajo";
    if (value <= 20) return "riesgo-moderado";
    if (value <= 30) return "riesgo-alto";
    return "riesgo-muy-alto";
  };

  const getLawtonColorClass = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "riesgo-sin-dato";
    if (value >= 8) return "riesgo-bajo";
    if (value >= 6) return "riesgo-moderado";
    if (value >= 3) return "riesgo-alto";
    return "riesgo-muy-alto";
  };

  return (
    <div className="survey-container">
      <h2>Encuestas Diligenciadas</h2>
      <div className="info-container">
        <div className="filters-card">
          <div className="filter-row">
            <label>
              Tipo de documento:
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
              Encuesta:
              <select
                value={escalaSeleccionada}
                onChange={(e) => {
                  setEscalaSeleccionada(e.target.value);
                  setFindriscFiltro("");
                  setFraminghamFiltro("");
                  setLawtonFiltro("");
                }}
              >
                <option value="">Todas</option>
                <option value="findrisc">FINDRISC</option>
                <option value="framingham">Framingham</option>
                <option value="lawton">Lawton-Brody</option>
              </select>
            </label>

            {escalaSeleccionada === "findrisc" && (
              <label>
                Riesgo FINDRISC:
                <select
                  value={findriscFiltro}
                  onChange={(e) => setFindriscFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Aumentado">Aumentado</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Alto">Alto</option>
                  <option value="Muy Alto">Muy Alto</option>
                  <option value="Sin dato">Sin dato</option>
                </select>
              </label>
            )}
            {escalaSeleccionada === "framingham" && (
              <label>
                Riesgo Framingham:
                <select
                  value={framinghamFiltro}
                  onChange={(e) => setFraminghamFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Alto">Alto</option>
                  <option value="Sin dato">Sin dato</option>
                </select>
              </label>
            )}
            {escalaSeleccionada === "lawton" && (
              <label>
                Riesgo Lawton:
                <select
                  value={lawtonFiltro}
                  onChange={(e) => setLawtonFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Independiente">Independiente</option>
                  <option value="Dependencia Leve">Dependencia Leve</option>
                  <option value="Dependencia Moderada">
                    Dependencia Moderada
                  </option>
                  <option value="Dependencia Total">Dependencia Total</option>
                  <option value="Sin dato">Sin dato</option>
                </select>
              </label>
            )}

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
              Intervención:
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
                  <th>FINDRISC</th>
                  <th>Framingham</th>
                  <th>LawtonBrody</th>
                  <th>Fecha</th>
                  <th>Intervención</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((d, i) => (
                  <tr key={i}>
                    <td>{d.tipoIdentificacion}</td>
                    <td>{d.identificacion}</td>
                    <td>{d.nombre}</td>
                    <td className={getFindriscColorClass(d.findrisc)}>
                      {d.findrisc !== null && d.findrisc !== undefined
                        ? d.findrisc
                        : "-"}
                    </td>
                    <td className={getFraminghamColorClass(d.framingham)}>
                      {d.framingham !== null && d.framingham !== undefined
                        ? d.framingham
                        : "-"}
                    </td>

                    <td className={getLawtonColorClass(d.lawtonBrody)}>
                      {d.lawtonBrody !== null && d.lawtonBrody !== undefined
                        ? d.lawtonBrody
                        : "-"}
                    </td>
                    <td>{format(parseISO(d.fecha), "dd/MM/yyyy")}</td>
                    <td style={{ fontWeight: "bold", textAlign: "center" }}>
                      {necesitaIntervencion(d) ? (
                        <button
                          onClick={() => {
                            setSelectedPatient({
                              _id: "",
                              tipoIdentificacion: d.tipoIdentificacion,
                              identificacion: d.identificacion,
                              nombre: d.nombre,
                              findrisc: d.findrisc,
                              framingham: d.framingham,
                              lawtonBrody: d.lawtonBrody,
                              fecha: d.fecha,
                            });
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
                      <InterventionModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={(text) => {
                          console.log(
                            "Texto de intervención para:",
                            selectedPatient?.identificacion
                          );
                          console.log("Intervención:", text);
                          // Aquí podrías hacer una petición al backend para guardar la intervención
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ultimaActualizacion && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginBottom: "8px",
                  textAlign: "right",
                }}
              >
                Última actualización:{" "}
                {format(ultimaActualizacion, "dd/MM/yyyy HH:mm:ss")}
              </p>
            )}

            {/* Paginador */}
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
    </div>
  );
};

export default SurveyTable;
