# Auditor JP - Aplicación de Auditorías de Inspección

## Documento de Entrega de Proyecto

---

### 1. Descripción General

**Auditor JP** es una aplicación web progresiva (PWA) diseñada para digitalizar y automatizar el proceso de auditorías de inspección en copropiedades. Reemplaza el flujo manual actual (Google Forms + creación manual de informes) por un sistema integrado que permite:

- Llenar el formulario de inspección desde el celular
- Tomar y adjuntar fotos como evidencia
- Generar automáticamente un informe PDF profesional
- Obtener análisis inteligente con IA (Google Gemini)

La aplicación funciona como una app instalable en el celular, no requiere descarga desde tiendas de aplicaciones y opera sin conexión a internet (excepto para el análisis de IA).

---

### 2. Problema que Resuelve

| Antes | Ahora con Auditor JP |
|-------|---------------------|
| Formulario en Google Forms | Formulario optimizado para móvil con wizard paso a paso |
| Fotos se toman aparte y se organizan manualmente | Fotos se adjuntan directamente a cada item de inspección |
| Informe se crea manualmente en Word/PDF | Informe PDF se genera automáticamente con un clic |
| No hay análisis de los datos | IA analiza los resultados y genera recomendaciones |
| Si se cierra el navegador se pierde el progreso | Auto-guardado automático, el progreso nunca se pierde |

---

### 3. Flujo de Uso

La aplicación guía al usuario a través de **6 pasos**:

#### Paso 1 - Datos Generales
- Fecha de inspección
- Selección de Director (lista de 28 directores con autocompletado)
- Selección de Auditor (lista de 9 auditores con autocompletado)
- Selección de Copropiedad (lista de ~220 copropiedades con búsqueda)
- Los emails se completan automáticamente al seleccionar director/auditor

#### Paso 2 - Documentos Legales (15 items)
Verificación de documentación administrativa:
- Reglamento de Propiedad Horizontal
- Manual de convivencia
- Actas de Asamblea y Consejo
- Pólizas, presupuestos, estados financieros
- Contratos, certificados, RUT
- Plan de emergencias, licencias, archivo documental

#### Paso 3 - Conocimientos (4 items)
Evaluación del administrador sobre:
- Estructura organizacional
- Reglamento de propiedad horizontal
- Procedimientos de emergencia
- Normatividad vigente (Ley 675 de 2001)

#### Paso 4 - Infraestructura (16 items)
Inspección física de áreas comunes:
- Fachadas, cubiertas, zonas verdes
- Ascensores, portería, iluminación
- Parqueaderos, piscina, salón comunal
- Sistema contra incendios, planta eléctrica
- Tanques de agua, sistema de bombeo

#### Paso 5 - Comentarios Generales
Campo libre para observaciones adicionales del auditor.

#### Paso 6 - Revisión y Generación
- Dashboard con porcentajes de cumplimiento por sección
- Puntaje general de cumplimiento
- Botón "Analizar con IA" para generar análisis inteligente
- Botón "Descargar Informe PDF" para obtener el documento final

**Cada item de inspección permite:**
- Marcar: Cumple / No Cumple / No Aplica
- Escribir una observación
- Adjuntar hasta 3 fotos (se comprimen automáticamente)

---

### 4. Informe PDF Generado

El PDF incluye las siguientes secciones:

1. **Portada**: Título, fecha, copropiedad, director y auditor
2. **Resumen Ejecutivo (IA)**: Nivel de riesgo, resumen general, estadísticas
3. **Resultados por Sección**: Tabla con porcentajes de cumplimiento
4. **Hallazgos Críticos (IA)**: Lista de problemas identificados
5. **Recomendaciones (IA)**: Acciones priorizadas por urgencia
6. **Documentos Legales**: Tabla detallada con estado y observaciones + fotos
7. **Conocimientos**: Tabla con evaluación del administrador
8. **Infraestructura**: Tabla detallada con estado y observaciones + fotos
9. **Comentarios Generales**: Observaciones del auditor
10. **Pie de página**: Nombre de copropiedad, fecha y numeración en cada página

---

### 5. Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
|-----------|-----------|-----------|
| Frontend | React 19 + TypeScript | Interfaz de usuario |
| Estilos | Tailwind CSS v4 | Diseño responsive mobile-first |
| Bundler | Vite 7 | Compilación y servidor de desarrollo |
| PDF | jsPDF + jspdf-autotable | Generación del informe |
| IA | Google Gemini 2.0 Flash | Análisis inteligente de resultados |
| Fotos | IndexedDB (idb-keyval) | Almacenamiento de imágenes (>50MB) |
| Datos | localStorage | Persistencia del formulario |
| PWA | vite-plugin-pwa | App instalable y offline |
| Iconos | Lucide React | Iconografía de la interfaz |

---

### 6. Instalación y Configuración

#### Requisitos previos
- Node.js versión 20.18 o superior
- npm (incluido con Node.js)

#### Pasos de instalación

```bash
# 1. Navegar al directorio del proyecto
cd "Proyecto JP"

# 2. Instalar dependencias
npm install

# 3. Configurar la API key de Gemini
# Editar el archivo .env.local y colocar la API key
# VITE_GEMINI_API_KEY=tu_api_key_aqui

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

#### Compilar para producción

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/` y pueden desplegarse en cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.).

#### Obtener API Key de Gemini (gratuita)

1. Ir a https://aistudio.google.com/apikey
2. Iniciar sesión con cuenta de Google
3. Crear una nueva API key
4. Copiarla en el archivo `.env.local`

**Límites de la capa gratuita:**
- 15 solicitudes por minuto
- 1 millón de tokens por día
- No requiere tarjeta de crédito

---

### 7. Estructura del Proyecto

```
Proyecto JP/
├── .env.local                         # API key (NO se sube a git)
├── index.html                         # HTML principal
├── package.json                       # Dependencias y scripts
├── vite.config.ts                     # Configuración de Vite + PWA
├── public/
│   └── icons/                         # Iconos de la PWA
├── src/
│   ├── App.tsx                        # Componente raíz
│   ├── main.tsx                       # Punto de entrada
│   ├── index.css                      # Estilos globales (Tailwind)
│   ├── types/
│   │   └── inspection.ts             # Definiciones de tipos
│   ├── data/
│   │   ├── directors.ts              # 28 directores
│   │   ├── auditors.ts              # 9 auditores
│   │   ├── copropiedades.ts         # ~220 copropiedades
│   │   └── inspectionSections.ts    # 35 items de inspección
│   ├── components/
│   │   ├── wizard/                   # 6 pasos del formulario
│   │   ├── inspection/               # Items y secciones
│   │   ├── ui/                       # Componentes reutilizables
│   │   └── report/                   # Generador de PDF
│   ├── hooks/                        # Lógica reutilizable
│   ├── services/                     # Comunicación con IA
│   └── utils/                        # Utilidades (scores, prompts, estilos PDF)
└── api/
    └── analyze.ts                    # Proxy serverless (para despliegue)
```

---

### 8. Personalización

#### Agregar o modificar items de inspección
Editar el archivo `src/data/inspectionSections.ts`. Cada item tiene:
- `id`: Identificador único
- `label`: Texto descriptivo del item
- `allowNA`: Si permite la opción "No Aplica"

#### Agregar directores o auditores
Editar `src/data/directors.ts` o `src/data/auditors.ts` agregando objetos con `name` y `email`.

#### Agregar copropiedades
Editar `src/data/copropiedades.ts` agregando nombres al array (se ordena alfabéticamente).

#### Modificar el diseño del PDF
- Colores y fuentes: `src/utils/pdfStyles.ts`
- Estructura y contenido: `src/components/report/PDFGenerator.tsx`

#### Modificar el prompt de IA
Editar `src/utils/buildAIPrompt.ts` para cambiar las instrucciones que recibe Gemini.

---

### 9. Características Técnicas Destacadas

- **Auto-guardado**: Los datos se guardan automáticamente cada 500ms. Si el usuario cierra la app o se queda sin batería, al reabrir todo está intacto.
- **Compresión de fotos**: Las imágenes se redimensionan a máximo 1200px de ancho y se comprimen a JPEG 70%, resultando en ~150KB por foto.
- **PWA instalable**: El usuario puede "instalar" la app desde el navegador en su celular y usarla como si fuera nativa.
- **Funciona offline**: Todo el formulario funciona sin internet. Solo se necesita conexión para el análisis con IA.
- **Mobile-first**: Diseñada prioritariamente para uso en celular durante las visitas de inspección.

---

### 10. Soporte y Mantenimiento

| Acción | Cómo hacerlo |
|--------|-------------|
| Actualizar dependencias | `npm update` |
| Verificar errores de tipos | `npx tsc --noEmit` |
| Compilar para producción | `npm run build` |
| Previsualizar build | `npm run preview` |
| Revisar código | `npm run lint` |

---

### 11. Seguridad

- La API key de Gemini se almacena en `.env.local` que nunca se sube al repositorio
- No se recopilan ni envían datos personales a servidores externos
- Las fotos y datos se almacenan únicamente en el dispositivo del usuario
- Solo el texto de la inspección (sin fotos) se envía a Gemini para el análisis
- El archivo `api/analyze.ts` está preparado para despliegue serverless donde la API key se protege en el servidor

---

*Documento generado para el proyecto Auditor JP*
*Fecha: Febrero 2026*
