 const data = [
    {
      tipoIdentificacion: "CC",
      identificacion: "1111",
      nombre: "Luis Perez",
      telefono: "3011111111",
      reporte: "La farmacia no tiene existencia del medicamento",
      requiereIntervencion: true,
      fecha: "2025-04-01T12:00:00.000Z",
    },
    {
      tipoIdentificacion: "CC",
      identificacion: "2222",
      nombre: "María Ruiz",
      telefono: "3022222222",
      reporte: "Requiere cambio de tratamiento",
      requiereIntervencion: true,
      fecha: "2025-04-02T09:00:00.000Z",
    },
    {
      tipoIdentificacion: "TI",
      identificacion: "3333",
      nombre: "Carlos Ortega",
      telefono: "3033333333",
      reporte: "Paciente reporta alergia al medicamento",
      requiereIntervencion: true,
      fecha: "2025-04-03T14:30:00.000Z",
    },
    {
      tipoIdentificacion: "CE",
      identificacion: "4444",
      nombre: "Ana Castaño",
      telefono: "3044444444",
      reporte: "Paciente retiró el medicamento sin problemas",
      requiereIntervencion: false,
      fecha: "2025-04-03T10:15:00.000Z",
    },
    {
      tipoIdentificacion: "CC",
      identificacion: "5555",
      nombre: "Sergio Molina",
      telefono: "3055555555",
      reporte: "Dificultad para acceder a la farmacia",
      requiereIntervencion: true,
      fecha: "2025-04-04T16:00:00.000Z",
    },
    {
        tipoIdentificacion: "TI",
        identificacion: "1000",
        nombre: "Paula Mendoza",
        telefono: "3063116311",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-03T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1001",
        nombre: "Sergio Molina",
        telefono: "3093329193",
        reporte: "Solicitud de renovación de fórmula",
        requiereIntervencion: false,
        fecha: "2025-04-07T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1002",
        nombre: "Natalia Ríos",
        telefono: "3052064290",
        reporte: "Cambio en prescripción médica",
        requiereIntervencion: false,
        fecha: "2025-04-09T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1003",
        nombre: "David Romero",
        telefono: "3047929915",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: false,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1004",
        nombre: "María Ruiz",
        telefono: "3027089211",
        reporte: "El paciente no entendió la dosificación",
        requiereIntervencion: true,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1005",
        nombre: "David Romero",
        telefono: "3083904083",
        reporte: "Paciente reporta alergia al medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-04T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1006",
        nombre: "Verónica León",
        telefono: "3089328113",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-12T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1007",
        nombre: "Laura Pérez",
        telefono: "3030948339",
        reporte: "Cambio en prescripción médica",
        requiereIntervencion: false,
        fecha: "2025-04-09T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1008",
        nombre: "Andrea Herrera",
        telefono: "3038799633",
        reporte: "Medicamento vencido",
        requiereIntervencion: true,
        fecha: "2025-04-15T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1009",
        nombre: "Paula Mendoza",
        telefono: "3045679278",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: true,
        fecha: "2025-04-03T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1010",
        nombre: "Luis Perez",
        telefono: "3090723615",
        reporte: "Dificultad para acceder a la farmacia",
        requiereIntervencion: false,
        fecha: "2025-04-14T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1011",
        nombre: "Camilo Vargas",
        telefono: "3073609882",
        reporte: "Cambio en prescripción médica",
        requiereIntervencion: false,
        fecha: "2025-04-15T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1012",
        nombre: "Sergio Molina",
        telefono: "3011975172",
        reporte: "Dificultad para acceder a la farmacia",
        requiereIntervencion: false,
        fecha: "2025-04-02T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1013",
        nombre: "Natalia Ríos",
        telefono: "3069200877",
        reporte: "Requiere cambio de tratamiento",
        requiereIntervencion: true,
        fecha: "2025-04-14T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1014",
        nombre: "Paula Mendoza",
        telefono: "3017659720",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: true,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1015",
        nombre: "Natalia Ríos",
        telefono: "3024888337",
        reporte: "Medicamento vencido",
        requiereIntervencion: false,
        fecha: "2025-04-07T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1016",
        nombre: "Sergio Molina",
        telefono: "3037070408",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1017",
        nombre: "Camilo Vargas",
        telefono: "3032038144",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-15T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1018",
        nombre: "Andrea Herrera",
        telefono: "3038503985",
        reporte: "El paciente no entendió la dosificación",
        requiereIntervencion: true,
        fecha: "2025-04-04T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1019",
        nombre: "Andrea Herrera",
        telefono: "3097783665",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-14T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1020",
        nombre: "Andrea Herrera",
        telefono: "3075619423",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-07T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1021",
        nombre: "David Romero",
        telefono: "3088790101",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: false,
        fecha: "2025-04-04T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1022",
        nombre: "Carlos Ortega",
        telefono: "3077921505",
        reporte: "Dificultad para acceder a la farmacia",
        requiereIntervencion: false,
        fecha: "2025-04-04T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1023",
        nombre: "Camilo Vargas",
        telefono: "3016980949",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-06T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1024",
        nombre: "Ana Castaño",
        telefono: "3011487496",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: false,
        fecha: "2025-04-02T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1025",
        nombre: "Laura Pérez",
        telefono: "3074554121",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-06T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1026",
        nombre: "María Ruiz",
        telefono: "3050279844",
        reporte: "El paciente no entendió la dosificación",
        requiereIntervencion: false,
        fecha: "2025-04-03T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1027",
        nombre: "Laura Pérez",
        telefono: "3081847419",
        reporte: "El paciente no entendió la dosificación",
        requiereIntervencion: true,
        fecha: "2025-04-14T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1028",
        nombre: "Sebastián García",
        telefono: "3052859408",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-09T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1029",
        nombre: "David Romero",
        telefono: "3041112753",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1030",
        nombre: "Carlos Ortega",
        telefono: "3039322128",
        reporte: "La farmacia no tiene existencia del medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-13T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1031",
        nombre: "Natalia Ríos",
        telefono: "3051593344",
        reporte: "Medicamento vencido",
        requiereIntervencion: true,
        fecha: "2025-04-15T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1032",
        nombre: "Ana Castaño",
        telefono: "3018148757",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-11T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1033",
        nombre: "Laura Pérez",
        telefono: "3023136621",
        reporte: "Cambio en prescripción médica",
        requiereIntervencion: false,
        fecha: "2025-04-06T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1034",
        nombre: "David Romero",
        telefono: "3017355366",
        reporte: "Paciente reporta alergia al medicamento",
        requiereIntervencion: true,
        fecha: "2025-04-10T00:00:00"
      },
      {
        tipoIdentificacion: "CE",
        identificacion: "1035",
        nombre: "Andrea Herrera",
        telefono: "3041140458",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: true,
        fecha: "2025-04-15T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1036",
        nombre: "Julián Ortega",
        telefono: "3061448472",
        reporte: "Entrega parcial por falta de stock",
        requiereIntervencion: true,
        fecha: "2025-04-10T00:00:00"
      },
      {
        tipoIdentificacion: "CC",
        identificacion: "1037",
        nombre: "María Ruiz",
        telefono: "3076981811",
        reporte: "Solicitud de renovación de fórmula",
        requiereIntervencion: true,
        fecha: "2025-04-02T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1038",
        nombre: "Sergio Molina",
        telefono: "3022492374",
        reporte: "Requiere cambio de tratamiento",
        requiereIntervencion: true,
        fecha: "2025-04-03T00:00:00"
      },
      {
        tipoIdentificacion: "TI",
        identificacion: "1039",
        nombre: "Paula Mendoza",
        telefono: "3028616760",
        reporte: "Paciente no retiró medicamento",
        requiereIntervencion: false,
        fecha: "2025-04-14T00:00:00"
      },
      
  ];
 export default data;