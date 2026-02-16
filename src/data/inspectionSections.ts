import type { InspectionSectionDef } from '../types/inspection';

export const inspectionSections: InspectionSectionDef[] = [
  {
    id: 'seguridad',
    title: 'Seguridad',
    description: 'Protocolos, personal y sistemas de seguridad',
    items: [
      {
        id: 'seg_01',
        label: 'Protocolos y Personal de Seguridad',
        criterio: 'Verificar existencia de protocolos escritos, bitácora de novedades actualizada, control de acceso vehicular y peatonal, rondas documentadas',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'seg_02',
        label: 'Seguridad Humana',
        criterio: 'Verificar plan de emergencias vigente, señalización de evacuación, extintores vigentes, gabinetes contra incendio, botiquín dotado, brigada conformada',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'seg_03',
        label: 'Señalítica',
        criterio: 'Verificar señalización de áreas comunes, zonas de parqueo, rutas de evacuación, puntos de encuentro, señales de prohibición y obligación',
        frecuencia: 'Trimestral',
        allowNA: false,
      },
    ],
  },
  {
    id: 'aseo',
    title: 'Aseo y Limpieza',
    description: 'Estado de limpieza y manejo de residuos',
    items: [
      {
        id: 'ase_01',
        label: 'Zonas Comunes',
        criterio: 'Verificar limpieza de pasillos, escaleras, ascensores, lobby, áreas sociales, parqueaderos y fachadas',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'ase_02',
        label: 'Cuarto de Basuras',
        criterio: 'Verificar separación en la fuente, limpieza del cuarto, cumplimiento de horarios de recolección, control de plagas, certificado de fumigación',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'ase_03',
        label: 'Insumos Químicos',
        criterio: 'Verificar fichas técnicas de productos, almacenamiento adecuado, rotulación, hojas de seguridad, elementos de protección personal',
        frecuencia: 'Trimestral',
        allowNA: true,
      },
    ],
  },
  {
    id: 'infraestructura',
    title: 'Infraestructura',
    description: 'Estado físico de instalaciones y equipos',
    items: [
      {
        id: 'inf_01',
        label: 'Cuartos Técnicos',
        criterio: 'Verificar estado de cuarto eléctrico, cuarto de bombas, planta eléctrica, subestación, cuarto de telecomunicaciones, acceso restringido',
        frecuencia: 'Mensual',
        allowNA: true,
      },
      {
        id: 'inf_02',
        label: 'Zonas Húmedas',
        criterio: 'Verificar estado de piscina, turco, sauna, jacuzzi, duchas, cumplimiento normativo de calidad de agua, certificado de operador',
        frecuencia: 'Mensual',
        allowNA: true,
      },
      {
        id: 'inf_03',
        label: 'Iluminación',
        criterio: 'Verificar funcionamiento de luminarias en áreas comunes, parqueaderos, zonas exteriores, iluminación de emergencia, sensores de movimiento',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'inf_04',
        label: 'Zonas de Esparcimiento',
        criterio: 'Verificar estado de salón comunal, gimnasio, juegos infantiles, zonas BBQ, canchas deportivas, mobiliario en buen estado',
        frecuencia: 'Trimestral',
        allowNA: true,
      },
    ],
  },
  {
    id: 'proyectos',
    title: 'Proyectos',
    description: 'Obras especiales y mejoras',
    items: [
      {
        id: 'pry_01',
        label: 'Obras Especiales',
        criterio: 'Verificar estado de obras en ejecución, permisos vigentes, pólizas del contratista, cronograma de avance, interventoría, impacto en copropietarios',
        frecuencia: 'Según necesidad',
        allowNA: true,
      },
    ],
  },
  {
    id: 'comunicacion',
    title: 'Comunicación',
    description: 'Informes de gestión y comunicaciones',
    items: [
      {
        id: 'com_01',
        label: 'Informes y Gestión',
        criterio: 'Verificar informes mensuales de gestión, actas de consejo al día, seguimiento a compromisos, indicadores de gestión, presupuesto vs ejecución',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'com_02',
        label: 'Carteleras y Comunicación',
        criterio: 'Verificar carteleras actualizadas, comunicados a copropietarios, canales digitales activos, atención oportuna a PQR',
        frecuencia: 'Mensual',
        allowNA: false,
      },
    ],
  },
  {
    id: 'servicios_publicos',
    title: 'Servicios Públicos',
    description: 'Control de servicios y sistemas de agua',
    items: [
      {
        id: 'ssp_01',
        label: 'Bitácora de Servicios Públicos',
        criterio: 'Verificar registro de consumos, comparativo mensual, detección de fugas, gestión de reclamaciones, lectura de medidores',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'ssp_02',
        label: 'Sistemas de Agua',
        criterio: 'Verificar lavado de tanques (certificado semestral), calidad de agua, estado de motobombas, sistema hidroneumático, válvulas de corte',
        frecuencia: 'Semestral',
        allowNA: false,
      },
    ],
  },
  {
    id: 'convivencia',
    title: 'Convivencia',
    description: 'Normas de convivencia y bienestar laboral',
    items: [
      {
        id: 'cnv_01',
        label: 'Normas y Personal',
        criterio: 'Verificar aplicación del manual de convivencia, gestión de conflictos, comité de convivencia activo, capacitación al personal operativo',
        frecuencia: 'Mensual',
        allowNA: false,
      },
      {
        id: 'cnv_02',
        label: 'Bienestar Laboral',
        criterio: 'Verificar cumplimiento de obligaciones laborales, ARL, EPS, dotación, horarios, pausas activas, clima laboral del personal de la copropiedad',
        frecuencia: 'Trimestral',
        allowNA: false,
      },
    ],
  },
];
