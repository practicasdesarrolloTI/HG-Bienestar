import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  parseISO,
  isWithinInterval,
  differenceInMonths,
} from "date-fns";
import "../styles/SurveyTable.css";
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  FileTextIcon,
  FileUserIcon,
  FunnelIcon,
} from "lucide-react";
import { getSurveyResults } from "../services/surveyResultService";
import { SurveyResult, Agrupado } from "../types/Survey.type";
import "../styles/colors.css";
import ClipLoader from "react-spinners/ClipLoader";
import EmptyMessage from "../components/EmptyMessage";
import InterventionModal from "../components/InterventionModal";
import ErrorComponent from "../components/ErrorComponent";
import {
  registrarIntervencion,
  getIntervenciones,
} from "../services/interventionService";
import { getCurrentUser } from "../services/authService";
import { Intervencion } from "../types/Intervenciones.type";
import { toast } from "react-toastify";
import FiltersModal from "../components/FiltersModal";

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
      if (encuesta.moriskyGreen !== null)
        grupoExistente.moriskyGreen = encuesta.moriskyGreen;

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
        moriskyGreen: encuesta.moriskyGreen,
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

const getmoriskyGreenCategoria = (value: number | null): string => {
  if (value === null) return "Sin dato";
  return value === 1 ? "Bajo" : "Alto";
};

const necesitaIntervencion = (row: SurveyResult | Agrupado): boolean => {
  const fr = getFindriscCategoria(row.findrisc);
  const fm = getFraminghamCategoria(row.framingham);
  const lb = getLawtonCategoria(row.lawtonBrody);
  const mog = getmoriskyGreenCategoria(row.moriskyGreen ?? null);

  return (
    fr === "Alto" ||
    fr === "Muy Alto" ||
    fm === "Alto" ||
    lb === "Dependencia Total" ||
    lb === "Dependencia Moderada" ||
    mog === "Alto"
  );
};

const SurveyTable: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);
  const [data, setData] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SurveyResult | null>(
    null
  );
  const [busquedaDocumento, setBusquedaDocumento] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(
    null
  );
  const [interventionText, setInterventionText] = useState("");
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);
  const [selectedFindriscCats, setSelectedFindriscCats] = useState<string[]>(
    []
  );
  const [selectedFraminghamCats, setSelectedFraminghamCats] = useState<
    string[]
  >([]);
  const [selectedLawtonCats, setSelectedLawtonCats] = useState<string[]>([]);
  const [selectedMoriskyCats, setSelectedMoriskyCats] = useState<string[]>([]);
  const [selectedIntervencion, setSelectedIntervencion] = useState<string[]>(
    []
  );

  const datosAgrupados = agruparPorPacienteYPeriodo(data);

  // Indicadores para la cabecera
  const totalPacientesEncuestados = datosAgrupados.length;
  const totalEncuestasCompletadas = data.length;

  // Pacientes que requieren intervención
  const pacientesQueRequierenIntervencion = datosAgrupados.filter((row) =>
    necesitaIntervencion(row)
  );

  const pacientesQueRequierenIntervencionPendiente = datosAgrupados.filter(row => {
    if (!necesitaIntervencion(row)) {
      return false; // no requiere → no lo contamos
    }
  
    // sí requiere → miramos si ya está cerrada
    const intervencionesPaciente = intervenciones.filter(interv =>
      interv.pacienteTipo === row.tipoIdentificacion &&
      interv.pacienteNumero === row.identificacion &&
      interv.fechaEncuesta === row.fecha
    );
  
    const estaCerrada = intervencionesPaciente.some(interv => interv.cerrada);
  
    // Solo contamos si NO está cerrada
    return !estaCerrada;
  });
  

  // Pacientes que ya tienen intervención (cruce con intervenciones)
  const pacientesConIntervencion = pacientesQueRequierenIntervencion.filter(
    (row) =>
      intervenciones.some(
        (interv) =>
          interv.pacienteTipo === row.tipoIdentificacion &&
          interv.pacienteNumero === row.identificacion &&
          interv.fechaEncuesta === row.fecha
      )
  );

  const intervencionesRealizadas = pacientesConIntervencion.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const cargarDatos = useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([getSurveyResults(), getIntervenciones()])
      .then(([resEncuestas, resIntervenciones]) => {
        setData(resEncuestas);
        // Mapear correctamente las intervenciones
        const intervencionesMapeadas = resIntervenciones.map(
          (item: Intervencion) => ({
            id: item.id,
            pacienteTipo: item.pacienteTipo,
            pacienteNumero: item.pacienteNumero,
            pacienteNombre: item.pacienteNombre,
            detalles: item.detalles ?? "",
            realizadaPor: item.realizadaPor,
            fechaEncuesta: item.fechaEncuesta,
            fechaIntervencion: item.fechaIntervencion,
            cerrada: item.cerrada || false,
          })
        );

        setIntervenciones(intervencionesMapeadas);
        setUltimaActualizacion(new Date());
        console.log("📊 Datos actualizados:", resEncuestas);
        console.log("📝 Intervenciones:", resIntervenciones);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error actualizando datos:", err);
        setError("No se pudo cargar la información.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 60000);

    return () => clearInterval(intervalo);
  }, [cargarDatos]);

  const handleRegistrarIntervencion = async (detalles: string) => {
    if (!selectedPatient) return;
    const usuario = getCurrentUser();

    console.log("📋 Registrando intervención:", {
      tipoIdentificacion: selectedPatient.tipoIdentificacion,
      identificacion: selectedPatient.identificacion,
      nombre: selectedPatient.nombre,
      detalles,
      usuario: usuario?.username || "",
      fecha: selectedPatient.fecha,
    });

    try {
      await registrarIntervencion(
        selectedPatient.tipoIdentificacion,
        selectedPatient.identificacion,
        selectedPatient.nombre || "",
        detalles,
        usuario?.username || "",
        selectedPatient.fecha
      );
      toast.success("Intervención registrada");

      setIsModalOpen(false); // cerrar modal
      setInterventionText(""); // limpiar text
      setSelectedPatient(null); // opcional: limpiar el selectedPatient
      cargarDatos(); // refrescar datos
    } catch {
      toast.error("Error al guardar intervención");
    }
  };

  /* Lógica de filtrado */

  const filteredData = datosAgrupados.filter((row) => {
    const fechaEncuesta = parseISO(row.fecha);

    if (
      selectedTipos.length > 0 &&
      !selectedTipos.includes(row.tipoIdentificacion)
    ) {
      return false;
    }
    const findriscCat = getFindriscCategoria(row.findrisc);
    if (
      selectedFindriscCats.length > 0 &&
      !selectedFindriscCats.includes(findriscCat)
    ) {
      return false;
    }
    const framinghamCat = getFraminghamCategoria(row.framingham);
    if (
      selectedFraminghamCats.length > 0 &&
      !selectedFraminghamCats.includes(framinghamCat)
    ) {
      return false;
    }
    const lawtonCat = getLawtonCategoria(row.lawtonBrody);
    if (
      selectedLawtonCats.length > 0 &&
      !selectedLawtonCats.includes(lawtonCat)
    ) {
      return false;
    }
    const moriskyCat = getmoriskyGreenCategoria(row.moriskyGreen ?? null);
    if (
      selectedMoriskyCats.length > 0 &&
      !selectedMoriskyCats.includes(moriskyCat)
    ) {
      return false;
    }
    if (
      fechaInicio &&
      fechaFin &&
      !isWithinInterval(fechaEncuesta, {
        start: fechaInicio,
        end: fechaFin,
      })
    ) {
      return false;
    }
    const necesita = necesitaIntervencion(row);

    if (
      selectedIntervencion.length > 0 &&
      selectedIntervencion.includes("Sí") &&
      !necesita
    ) {
      return false;
    }
    if (
      selectedIntervencion.length > 0 &&
      selectedIntervencion.includes("No") &&
      necesita
    ) {
      return false;
    }
    if (
      busquedaDocumento &&
      !row.identificacion
        .toLowerCase()
        .includes(busquedaDocumento.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  /*Modal*/
  const toggleFiltersModal = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };
  const clearAllFilters = () => {
    setSelectedTipos([]);
    setSelectedFindriscCats([]);
    setSelectedFraminghamCats([]);
    setSelectedLawtonCats([]);
    setSelectedMoriskyCats([]);
    setFechaInicio(null);
    setFechaFin(null);
    setSelectedIntervencion([]);
    setBusquedaDocumento("");
  };
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
      moriskyGreen: row.moriskyGreen ?? "-",
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
        <p style={{ marginTop: "10px" }}>Cargando ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent message={error || "Error al cargar la información"} />
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

  const getMoriskyGreenColorClass = (
    value: number | null | undefined
  ): string => {
    if (value === null || value === undefined) return "riesgo-sin-dato";
    return value === 1 ? "riesgo-bajo" : "riesgo-alto";
  };

  return (
    <div className="survey-page">
      {/* Encabezado (Título + Acciones) */}
      <div className="page-header">
        <div className="page-title-container">
          <h2> Encuestas de Pacientes</h2>
          <p>Gestión y seguimiento de encuestas de salud</p>
        </div>
        <div className="page-actions">
          <button
            onClick={exportToExcel}
            disabled={filteredData.length === 0}
            className={
              filteredData.length === 0 ? "disabled-btn" : "btn btn-outline"
            }
          >
            <FileTextIcon size={16} className="icon" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="cards-grid">
        <div className="card">
          <div className="card-inner">
            <div>
              <p className="card-label">Total Pacientes</p>
              <p className="card-value"> {totalPacientesEncuestados}</p>
            </div>
            <div className="icon-container blue">
              <FileUserIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div>
              <p className="card-label">Encuestas completadas</p>
              <p className="card-value"> {totalEncuestasCompletadas}</p>
            </div>
            <div className="icon-container  purple">
              <FileTextIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div>
              <p className="card-label">Pendientes por intervención</p>
              <p className="card-value">
                {" "}
                {pacientesQueRequierenIntervencionPendiente.length}
              </p>
            </div>
            <div className="icon-container red">
              <AlertCircleIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div>
              <p className="card-label">Intervenciones cerradas</p>
              <p className="card-value"> {intervencionesRealizadas}</p>
            </div>
            <div className="icon-container green">
              <CheckCircleIcon size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Tabla */}

      <div className="survey-container">
        <div className="survey-results-container">
          <div className="survey-header">
            <h2>Resultados de Encuestas</h2>
           <div className="filters-container"> 
            <input
              type="text"
              placeholder="Buscar por documento..."
              value={busquedaDocumento}
              onChange={(e) => setBusquedaDocumento(e.target.value)}
              className="search-input"
            />
            <FiltersModal
              show={showFilters}
              onClose={() => setShowFilters(false)}
              onApply={applyFilters}
              onClearAll={clearAllFilters}
              selectedTipos={selectedTipos}
              setSelectedTipos={setSelectedTipos}
              selectedFindriscCats={selectedFindriscCats}
              setSelectedFindriscCats={setSelectedFindriscCats}
              selectedFraminghamCats={selectedFraminghamCats}
              setSelectedFraminghamCats={setSelectedFraminghamCats}
              selectedLawtonCats={selectedLawtonCats}
              setSelectedLawtonCats={setSelectedLawtonCats}
              selectedMoriskyCats={selectedMoriskyCats}
              setSelectedMoriskyCats={setSelectedMoriskyCats}
              fechaInicio={fechaInicio}
              setFechaInicio={setFechaInicio}
              fechaFin={fechaFin}
              setFechaFin={setFechaFin}
              selectedIntervencion={selectedIntervencion}
              setSelectedIntervencion={setSelectedIntervencion}
            />
            <button onClick={toggleFiltersModal} className="btn-icon">
              <FunnelIcon size={16} />
            </button>
          </div>
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
                    <th>Lawton-Brody</th>
                    <th>Morisky-Green</th>
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

                      <td
                        className={getMoriskyGreenColorClass(
                          d.moriskyGreen ?? null
                        )}
                      >
                        {d.moriskyGreen !== null && d.moriskyGreen !== undefined
                          ? d.moriskyGreen
                          : "-"}
                      </td>

                      <td>{format(parseISO(d.fecha), "dd/MM/yyyy")}</td>
                      <td
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        {(() => {
                          const necesita = necesitaIntervencion(d);

                          const intervencionesPaciente = intervenciones.filter(
                            (interv) =>
                              interv.pacienteTipo === d.tipoIdentificacion &&
                              interv.pacienteNumero === d.identificacion &&
                              interv.fechaEncuesta === d.fecha
                          );

                          const estaCerrada = intervencionesPaciente.some(
                            (interv) => interv.cerrada
                          );

                          if (!necesita) {
                            // No requiere intervención
                            return (
                              <>
                                <XCircleIcon
                                  style={{
                                    color: "#9E9E9E",
                                    fontSize: "0.95rem",
                                  }}
                                  aria-label="No requerida"
                                />
                                <span
                                  style={{
                                    color: "#666",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  No requerida
                                </span>
                              </>
                            );
                          } else if (estaCerrada) {
                            // Ya completada
                            return (
                              <>
                                <CheckCircleIcon
                                  style={{
                                    color: "#00C853",
                                    fontSize: "0.95rem",
                                  }}
                                  aria-label="Completada"
                                />
                                <span
                                  style={{
                                    color: "#666",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Completada
                                </span>
                              </>
                            );
                          } else {
                            // Pendiente (botón de intervención)
                            return (
                              <>
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
                                    setInterventionText("");
                                    setIsModalOpen(true);
                                  }}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                  title="Registrar intervención"
                                >
                                  <AlertCircleIcon
                                    style={{
                                      color: "#FF0000",
                                      fontSize: "0.95rem",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#FF0000",
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    Pendiente
                                  </span>
                                </button>

                                <InterventionModal
                                  key={
                                    selectedPatient
                                      ? `${selectedPatient.tipoIdentificacion}-${selectedPatient.identificacion}-${selectedPatient.fecha}`
                                      : "empty"
                                  }
                                  isOpen={isModalOpen}
                                  onClose={() => {
                                    setIsModalOpen(false);
                                    setInterventionText("");
                                    setSelectedPatient(null);
                                  }}
                                  onSave={handleRegistrarIntervencion}
                                  intervencionesAnteriores={
                                    selectedPatient
                                      ? intervenciones.filter(
                                          (interv) =>
                                            interv.pacienteTipo ===
                                              selectedPatient.tipoIdentificacion &&
                                            interv.pacienteNumero ===
                                              selectedPatient.identificacion
                                        )
                                      : []
                                  }
                                  onRefresh={cargarDatos}
                                  text={interventionText}
                                  setText={setInterventionText}
                                />
                              </>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

             
            </div>
          ) : (
            <EmptyMessage message="No se encontraron datos en tu búsqueda." />
          )}
        </div>
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
    </div>
  );
};

export default SurveyTable;
