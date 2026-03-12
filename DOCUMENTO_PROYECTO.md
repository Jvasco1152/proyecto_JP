# Auditor JP - Aplicación de Auditorías de Inspección

## Documento de Entrega de Proyecto

---

### 1. Descripción General

**Auditor JP** es una aplicación web progresiva (PWA) diseñada para digitalizar y automatizar el proceso de auditorías de inspección y supervisión integral en copropiedades. Reemplaza el flujo manual actual (Google Forms + creación manual de informes) por un sistema integrado que permite:

- Iniciar sesión de forma segura con usuario y contraseña
- Seleccionar el tipo de formulario de auditoría según la visita
- Llenar el formulario de inspección desde el celular paso a paso
- Tomar y adjuntar fotos como evidencia en cada ítem
- Generar automáticamente informes Word (.docx) y Excel (.xlsx) ejecutivos profesionales
- Obtener análisis inteligente con IA (Groq / Llama 4 Scout)

La aplicación funciona como una app instalable en el celular, no requiere descarga desde tiendas de aplicaciones y opera sin conexión a internet (excepto para el análisis de IA).

---

### 2. Problema que Resuelve

| Antes | Ahora con Auditor JP |
|-------|---------------------|
| Formulario en Google Forms | Formulario optimizado para móvil con wizard paso a paso |
| Fotos se toman aparte y se organizan manualmente | Fotos se adjuntan directamente a cada ítem de inspección |
| Informe se crea manualmente en Word/PDF | Informe Word y Excel ejecutivo se genera automáticamente con un clic |
| No hay análisis de los datos | IA analiza los resultados y genera recomendaciones |
| Si se cierra el navegador se pierde el progreso | Auto-guardado automático, el progreso nunca se pierde |
| Solo Cumple / No Cumple | Escala de 4 niveles: Cumple, Cumple Parcial, No Cumple, N/A |
| Sin control de acceso | Login seguro con usuario y contraseña (sesión de 8 horas) |
| Un único formulario | 3 formularios especializados según el tipo de auditoría |

---

### 3. Tipos de Formulario

La aplicación cuenta con **3 formularios de auditoría** seleccionables desde la pantalla de inicio:

| Formulario | Secciones | Ítems | Color |
|-----------|-----------|-------|-------|
| **Gestión Operativa e Infraestructura** | 8 | 51 | Azul |
| **Unificada Completa** | 5 | 25 | Verde |
| **Auditoría Norma** | 3 | 34 | Morado |

---

### 4. Matrices de Inspección

#### Formulario 1 — Gestión Operativa e Infraestructura (Auditoría Interna Operaciones AY)

| Sección | Ítems |
|---------|-------|
| **Seguridad — Portería** | Presentación personal, Minutas, CCTV, Gabinete de llaves, Mensajería, Accesos, Protocolos, Capacitación (8 ítems) |
| **Documentos** | PMIRS, Plan de Emergencias, SG-SST, Plan de trabajo, Informe de vulnerabilidad (5 ítems) |
| **Zonas Comunes** | Iluminación, Salón social, Zonas verdes, Juegos infantiles, Puntos fijos, Convivencia, Comunicación, Ascensores (8 ítems) |
| **Piscina y Zonas Húmedas** | Piscina aseo, Piscina documentos, Piscina infraestructura, Cuarto químicos piscina, Turco, Sauna, Jacuzzi (7 ítems) |
| **Cuartos de Residuos** | Aseo, Separación de residuos, Infraestructura, Normativo (4 ítems) |
| **Cuartos Técnicos** | Planta eléctrica, Bombas y tanques, RCI, Subestación, Cuarto personal, Cuarto químicos (6 ítems) |
| **Elementos de Seguridad** | Extintores, Gabinetes, Señalización, RCI, Botiquines, Alarmas, Lámparas emergencia, Sensores humo (8 ítems) |
| **Ejecución de Obras** | Documentación legal, Organización, Señalización, EPP, Acompañamiento técnico (5 ítems) |

#### Formulario 2 — Unificada Completa

| Sección | Ítems |
|---------|-------|
| **Fundamentación Legal y Administrativa** | Existencia y Reglamentación, Protección Patrimonial, Gestión de Órganos de Dirección, Evaluación de Gestión |
| **Seguridad, Emergencias y Salud (SG-SST)** | Seguridad Física y Electrónica, Plan de Emergencias, Seguridad Humana y Equipos, Botiquines, SG-SST |
| **Gestión Ambiental y Aseo (PMIRS)** | PMIRS, Estado Operativo de Aseo, Cuarto de Basuras, Gestión de Sustancias Químicas |
| **Infraestructura y Ley de Piscinas** | Cuartos Técnicos, Mantenimiento Operativo, Movilidad y Accesibilidad, Estándar de Piscinas, Personal Técnico, Reglamentación de Zonas |
| **Proyectos, Comunicación y Bienestar** | Planeación de Proyectos, Estrategias de Comunicación, Control de Recursos, Sistemas de Agua, Bienestar Laboral, Convivencia |

#### Formulario 3 — Auditoría Norma

| Sección | Ítems |
|---------|-------|
| **Documentos Legales Copropiedad** | Personería Jurídica, RPH, Póliza de Seguro, PMIRS, Plan de Emergencias, SG-SST, Diagnóstico Inicial, Plan de Trabajo, Actas de Consejo, Actas de Asamblea, Contratos, Inventario, Plan de Mantenimiento, Informe de Vulnerabilidad (14 ítems) |
| **Conocimientos a Evaluar** | Procedimiento de Compras, Quejas y Reclamos, Perfil del Cargo, Administración de PH (4 ítems) |
| **Infraestructura** | Cuarto de Basuras, Señalización Emergencia, Señalización Videovigilancia, Señalización "Espacio Libre de Humo", Control de Agua Piscina, Exámenes Piscina, Normatividad Piscinas, Certificado Piscinero, Productos Químicos, Botiquines, Parqueadero Movilidad Reducida, Productos de Aseo, Reglamentos Zonas Comunes, Espacios de Descanso, Estrategias de Comunicación, Cuartos Técnicos (16 ítems) |

---

### 5. Escala de Evaluación y Cálculo de Porcentajes

#### Escala de Evaluación

| Estado | Puntuación | Color |
|--------|-----------|-------|
| **Cumple (C)** | 100% | Verde |
| **Cumple Parcial (CP)** | 50% | Amarillo/Amber |
| **No Cumple (NC)** | 0% | Rojo |
| **No Aplica (NA)** | Excluido del cálculo | Gris |

#### Fórmula de Cálculo

**Por sección:**
```
% sección = REDONDEAR( (Cumple × 100 + CumpleParcial × 50) / ítems_evaluados )
```

Los ítems marcados como **No Aplica no se cuentan** en el denominador — no penalizan ni benefician el puntaje.

**Cumplimiento general:**

Se aplica la misma fórmula sumando todos los ítems de todas las secciones. Es un **promedio ponderado por cantidad de ítems** (no por sección), por lo que las secciones con más ítems tienen mayor peso en el total.

**Ejemplo:** Sección con 4 ítems evaluados: 2 Cumple, 1 Cumple Parcial, 1 No Cumple
```
(2 × 100 + 1 × 50 + 1 × 0) / 4 = 250 / 4 = 62.5 → 63%
```

Cada ítem incluye un **criterio de verificación** que guía al auditor sobre qué debe revisar, y una **frecuencia** recomendada de inspección.

---

### 6. Flujo de Uso

#### Pantalla de Login
El auditor ingresa su usuario y contraseña. La sesión dura 8 horas antes de expirar automáticamente.

#### Pantalla de Inicio
Muestra las 3 tarjetas de formulario disponibles. El auditor selecciona la que corresponde a la visita.

#### Wizard de Inspección
El formulario guía al auditor a través de pasos secuenciales:

| Paso | Contenido |
|------|-----------|
| **Paso 0 — Datos Generales** | Fecha, Director (lista con autocompletado), Auditor (lista), Copropiedad (~220 opciones con búsqueda) |
| **Pasos 1..N — Secciones** | Un paso por cada sección del formulario seleccionado |
| **Paso N+1 — Comentarios** | Campo libre para observaciones generales del auditor |
| **Paso N+2 — Informe** | Dashboard de resultados + análisis IA + descarga de informes |

**Cada ítem de inspección permite:**
- Marcar: Cumple / Cumple Parcial / No Cumple / No Aplica
- Ver el criterio de verificación como guía
- Escribir una observación
- Adjuntar hasta 3 fotos (se comprimen automáticamente)

#### Paso Final — Revisión y Generación
- Dashboard con porcentajes de cumplimiento por sección
- Puntaje general de cumplimiento
- Conteo de C, CP, NC y N/A por sección
- Botón **"Analizar con IA"** → genera análisis inteligente (Groq / Llama 4 Scout)
- Botón **"Descargar Informe Word"** → descarga el informe ejecutivo .docx
- Botón **"Descargar Excel"** → descarga el informe tabular .xlsx

---

### 7. Informes Generados

#### Informe Word (.docx)

1. **Portada**: Título, copropiedad, fecha, director, auditor y porcentaje de cumplimiento general
2. **Resumen Ejecutivo (IA)**: Nivel de riesgo, resumen general
3. **Resultados por Sección**: Tabla con Cumple, Parcial, No Cumple, N/A y porcentaje por cada grupo
4. **Hallazgos Críticos (IA)**: Lista de problemas identificados
5. **Recomendaciones (IA)**: Acciones priorizadas por urgencia
6. **Detalle por Sección**: Tablas (Ítem | Criterio | Estado | Observación) con evidencia fotográfica embebida
7. **Comentarios Generales**: Observaciones del auditor

#### Informe Excel (.xlsx)

- **Hoja 1 — Datos Generales**: Información de la visita (fecha, director, auditor, copropiedad)
- **Hoja 2 — Resumen por Sección**: Conteos y porcentaje por cada sección
- **Hoja 3 — Detalle con Fotos**: Todos los ítems con estado, observación y fotos embebidas

---

### 8. Autenticación

El acceso a la aplicación está protegido por usuario y contraseña:

- Las contraseñas se almacenan como **hash SHA-256** (nunca en texto plano)
- La sesión se guarda en `localStorage` con expiración automática de **8 horas**
- Hay un botón de **cerrar sesión** visible en la pantalla de inicio y dentro del wizard

#### Credenciales por defecto
- **Usuario**: `admin`
- **Contraseña**: `jp2025`

#### Para cambiar la contraseña
```bash
node scripts/generate-hash.mjs nueva_contraseña
# Copiar el hash resultante a la variable VITE_AUTH_PASSWORD_HASH
```

---

### 9. Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
|-----------|-----------|-----------|
| Frontend | React 19 + TypeScript | Interfaz de usuario |
| Estilos | Tailwind CSS v4 | Diseño responsive mobile-first |
| Bundler | Vite 7 | Compilación y servidor de desarrollo |
| Informe Word | docx + file-saver | Generación del informe Word ejecutivo |
| Informe Excel | ExcelJS + file-saver | Generación del informe tabular con fotos |
| IA | Groq API (Llama 4 Scout) | Análisis inteligente de resultados |
| Fotos | IndexedDB (idb-keyval) | Almacenamiento de imágenes en dispositivo |
| Datos | localStorage | Persistencia del formulario (versionado v3) |
| PWA | vite-plugin-pwa | App instalable y offline |
| Iconos | Lucide React | Iconografía de la interfaz |

---

### 10. Instalación y Configuración

#### Requisitos previos
- Node.js versión 20.18 o superior

#### Pasos de instalación

```bash
# 1. Navegar al directorio del proyecto
cd "Proyecto JP"

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con:
VITE_GROQ_API_KEY=tu_api_key_de_groq
VITE_AUTH_USERNAME=admin
VITE_AUTH_PASSWORD_HASH=sha256_del_password

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

#### Compilar para producción

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

---

### 11. Despliegue en Producción (Vercel)

La aplicación está desplegada en **Vercel** con integración continua desde GitHub.

| Recurso | URL |
|---------|-----|
| **Repositorio** | https://github.com/Jvasco1152/proyecto_JP |
| **Producción** | *(URL asignada por Vercel)* |

#### Variables de entorno requeridas en Vercel

| Variable | Descripción |
|----------|-------------|
| `VITE_GROQ_API_KEY` | API key de Groq (llamada directa desde el cliente) |
| `VITE_AUTH_USERNAME` | Nombre de usuario para el login |
| `VITE_AUTH_PASSWORD_HASH` | Hash SHA-256 de la contraseña de acceso |

#### Despliegue continuo

Cada `git push` a la rama `main` dispara un nuevo deploy automático en Vercel (~30 segundos).

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

#### Obtener API Key de Groq (gratuita)

1. Ir a https://console.groq.com
2. Crear cuenta o iniciar sesión
3. Crear una nueva API key
4. Copiarla como `VITE_GROQ_API_KEY` en `.env.local` y en las variables de Vercel

---

### 12. Estructura del Proyecto

```
proyecto_JP/
├── .env.local                          # Variables de entorno locales (NO se sube a git)
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts                      # Vite + PWA
├── DOCUMENTO_PROYECTO.md               # Este documento
├── scripts/
│   └── generate-hash.mjs              # Utilidad CLI para generar hash SHA-256
├── public/
│   └── icons/                         # Iconos SVG de la PWA
├── src/
│   ├── App.tsx                        # Gate de autenticación + selección de formulario
│   ├── main.tsx
│   ├── index.css                      # Estilos globales (Tailwind v4)
│   ├── types/
│   │   └── inspection.ts             # Tipos: FormType, InspectionSectionDef, etc.
│   ├── data/
│   │   ├── formRegistry.ts           # Mapa FormType → FormConfig (3 formularios)
│   │   ├── form1Sections.ts          # Formulario 1: 7 secciones, 18 ítems
│   │   ├── form2Sections.ts          # Formulario 2: 5 secciones, 25 ítems
│   │   ├── form3Sections.ts          # Formulario 3: 3 secciones, 34 ítems
│   │   ├── directors.ts             # Lista de directores (nombre + email)
│   │   ├── auditors.ts              # Lista de auditores (nombre + email)
│   │   └── copropiedades.ts         # ~220 copropiedades
│   ├── components/
│   │   ├── LoginScreen.tsx           # Pantalla de login
│   │   ├── HomeScreen.tsx            # Selección de formulario (3 tarjetas)
│   │   └── wizard/
│   │       ├── WizardLayout.tsx     # Wizard dinámico (pasos según formulario)
│   │       ├── StepHeader.tsx       # Paso 0: Datos generales
│   │       ├── StepInspectionGroup.tsx # Pasos 1..N: secciones de inspección
│   │       ├── StepComentarios.tsx  # Paso N+1: Comentarios generales
│   │       └── StepReview.tsx       # Paso N+2: Dashboard + IA + descarga informes
│   │   └── report/
│   │       ├── WordGenerator.ts     # Generador de informe Word
│   │       └── ExcelGenerator.ts    # Generador de informe Excel
│   ├── hooks/
│   │   ├── useAuth.ts               # Login SHA-256, sesión 8h
│   │   └── useAIAnalysis.ts         # Integración con Groq
│   ├── services/
│   │   ├── aiService.ts             # Llamada a Groq API
│   │   └── imageCompressor.ts       # Compresión de fotos (JPEG 70%, max 1200px)
│   └── utils/
│       ├── calculateScores.ts       # Cálculo de puntajes por sección y general
│       ├── buildAIPrompt.ts         # Prompt para la IA
│       └── reportStyles.ts          # Estilos y etiquetas para informes
```

---

### 13. Personalización

#### Agregar o modificar ítems de inspección
Editar el archivo `src/data/form1Sections.ts`, `form2Sections.ts` o `form3Sections.ts`. Cada ítem tiene:
- `id`: Identificador único (ej. `f1_seg_01`)
- `label`: Texto descriptivo del ítem
- `criterio`: Criterio de verificación que guía al auditor
- `frecuencia`: Frecuencia recomendada de inspección
- `allowNA`: Si permite la opción "No Aplica"

#### Agregar directores o auditores
Editar `src/data/directors.ts` o `src/data/auditors.ts` agregando objetos con `name` y `email`.

#### Agregar copropiedades
Editar `src/data/copropiedades.ts` agregando nombres al array.

#### Modificar el diseño del informe Word
- Estilos y etiquetas: `src/utils/reportStyles.ts`
- Estructura y contenido: `src/components/report/WordGenerator.ts`

#### Modificar el informe Excel
Editar `src/components/report/ExcelGenerator.ts`.

#### Modificar el prompt de IA
Editar `src/utils/buildAIPrompt.ts`.

---

### 14. Características Técnicas Destacadas

- **Auto-guardado**: Los datos se guardan automáticamente cada 500ms. Si el usuario cierra la app o se queda sin batería, al reabrir todo está intacto (localStorage v3).
- **Compresión de fotos**: Las imágenes se redimensionan a máximo 1200px de ancho y se comprimen a JPEG 70% (~150KB por foto).
- **PWA instalable**: El usuario puede "instalar" la app desde el navegador en su celular y usarla como si fuera nativa.
- **Funciona offline**: Todo el formulario funciona sin internet. Solo se necesita conexión para el análisis con IA.
- **Mobile-first**: Diseñada prioritariamente para uso en celular durante las visitas de inspección.
- **Criterios de verificación**: Cada ítem muestra al auditor exactamente qué debe verificar, estandarizando las inspecciones.
- **Wizard dinámico**: El número de pasos varía automáticamente según el formulario seleccionado.
- **Autenticación segura**: Contraseñas hasheadas con SHA-256 vía Web Crypto API (nativo del navegador, sin librerías externas).

---

### 15. Soporte y Mantenimiento

| Acción | Cómo hacerlo |
|--------|-------------|
| Actualizar dependencias | `npm update` |
| Verificar errores de tipos | `npx tsc --noEmit` |
| Compilar para producción | `npm run build` |
| Previsualizar build | `npm run preview` |
| Revisar código | `npm run lint` |
| Cambiar contraseña | `node scripts/generate-hash.mjs nueva_contraseña` |

---

### 16. Seguridad

- **Autenticación**: Hash SHA-256 de contraseñas. La contraseña nunca se almacena en texto plano.
- **Sesión con expiración**: Las sesiones expiran automáticamente a las 8 horas.
- **API key de Groq**: En desarrollo se usa `VITE_GROQ_API_KEY` en `.env.local` (excluido de git). En producción se configura como variable de entorno en Vercel.
- **Datos del usuario**: Las fotos y datos del formulario se almacenan únicamente en el dispositivo del usuario (IndexedDB y localStorage). No se envían a ningún servidor propio.
- **Datos enviados a IA**: Solo el texto de la inspección (sin fotos ni datos personales sensibles) se envía a Groq para el análisis.
- **Repositorio**: El archivo `.env.local` y la carpeta `.claude/` están excluidos del repositorio.

---

### 17. Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| **v1.0** | Febrero 2026 | Lanzamiento inicial: 35 ítems, 3 secciones, 6 pasos, informe PDF |
| **v2.0** | Febrero 2026 | Nueva matriz: 17 ítems, 7 grupos, 10 pasos, informe Word ejecutivo, estado "Cumple Parcial", criterios de verificación |
| **v3.0** | Marzo 2026 | Sistema de autenticación (SHA-256), 3 formularios independientes, wizard dinámico, informe Excel, IA con Groq (Llama 4 Scout), pantalla de inicio multi-formulario |

---

### 18. Contacto y Repositorio

| Recurso | Enlace |
|---------|--------|
| **Código fuente** | https://github.com/Jvasco1152/proyecto_JP |
| **Hosting** | Vercel (despliegue automático desde GitHub) |

---

*Documento generado para el proyecto Auditor JP*
*Última actualización: Marzo 2026*
