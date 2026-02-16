# Auditor JP - Aplicación de Auditorías de Inspección

## Documento de Entrega de Proyecto

---

### 1. Descripción General

**Auditor JP** es una aplicación web progresiva (PWA) diseñada para digitalizar y automatizar el proceso de auditorías de inspección y supervisión integral en copropiedades. Reemplaza el flujo manual actual (Google Forms + creación manual de informes) por un sistema integrado que permite:

- Llenar el formulario de inspección desde el celular
- Tomar y adjuntar fotos como evidencia
- Generar automáticamente un informe Word ejecutivo profesional
- Obtener análisis inteligente con IA (Google Gemini)

La aplicación funciona como una app instalable en el celular, no requiere descarga desde tiendas de aplicaciones y opera sin conexión a internet (excepto para el análisis de IA).

---

### 2. Problema que Resuelve

| Antes | Ahora con Auditor JP |
|-------|---------------------|
| Formulario en Google Forms | Formulario optimizado para móvil con wizard paso a paso |
| Fotos se toman aparte y se organizan manualmente | Fotos se adjuntan directamente a cada item de inspección |
| Informe se crea manualmente en Word/PDF | Informe Word ejecutivo se genera automáticamente con un clic |
| No hay análisis de los datos | IA analiza los resultados y genera recomendaciones |
| Si se cierra el navegador se pierde el progreso | Auto-guardado automático, el progreso nunca se pierde |
| Solo Cumple / No Cumple | Escala de 4 niveles: Cumple, Cumple Parcial, No Cumple, N/A |

---

### 3. Matriz de Inspección

La aplicación implementa la **Matriz de Auditoría y Supervisión Integral** con **17 items** organizados en **7 grupos**:

| Grupo | Items | Frecuencia |
|-------|-------|------------|
| **Seguridad** | Protocolos y Personal, Seguridad Humana, Señalítica | Mensual/Trimestral |
| **Aseo y Limpieza** | Zonas Comunes, Cuarto de Basuras, Insumos Químicos | Mensual/Trimestral |
| **Infraestructura** | Cuartos Técnicos, Zonas Húmedas, Iluminación, Zonas de Esparcimiento | Mensual/Trimestral |
| **Proyectos** | Obras Especiales | Según necesidad |
| **Comunicación** | Informes y Gestión, Carteleras y Comunicación | Mensual |
| **Servicios Públicos** | Bitácora de SSPP, Sistemas de Agua | Mensual/Semestral |
| **Convivencia** | Normas y Personal, Bienestar Laboral | Mensual/Trimestral |

#### Escala de Evaluación

| Estado | Puntuación | Color |
|--------|-----------|-------|
| **Cumple (C)** | 100% | Verde |
| **Cumple Parcial (CP)** | 50% | Amarillo/Amber |
| **No Cumple (NC)** | 0% | Rojo |
| **No Aplica (NA)** | Excluido del cálculo | Gris |

Cada item incluye un **criterio de verificación** que guía al auditor sobre qué debe verificar, y una **frecuencia** recomendada de inspección.

---

### 4. Flujo de Uso

La aplicación guía al usuario a través de **10 pasos**:

#### Paso 1 - Datos Generales
- Fecha de inspección
- Selección de Director (lista de 28 directores con autocompletado)
- Selección de Auditor (lista de 9 auditores con autocompletado)
- Selección de Copropiedad (lista de ~220 copropiedades con búsqueda)
- Los emails se completan automáticamente al seleccionar director/auditor

#### Paso 2 - Seguridad (3 items)
- Protocolos y Personal de Seguridad
- Seguridad Humana
- Señalítica

#### Paso 3 - Aseo y Limpieza (3 items)
- Zonas Comunes
- Cuarto de Basuras
- Insumos Químicos

#### Paso 4 - Infraestructura (4 items)
- Cuartos Técnicos
- Zonas Húmedas
- Iluminación
- Zonas de Esparcimiento

#### Paso 5 - Proyectos (1 item)
- Obras Especiales

#### Paso 6 - Comunicación (2 items)
- Informes y Gestión
- Carteleras y Comunicación

#### Paso 7 - Servicios Públicos (2 items)
- Bitácora de Servicios Públicos
- Sistemas de Agua

#### Paso 8 - Convivencia (2 items)
- Normas y Personal
- Bienestar Laboral

#### Paso 9 - Comentarios Generales
Campo libre para observaciones adicionales del auditor.

#### Paso 10 - Revisión y Generación
- Dashboard con porcentajes de cumplimiento por sección
- Puntaje general de cumplimiento
- Conteo de Cumple, Cumple Parcial, No Cumple y N/A por sección
- Botón "Analizar con IA" para generar análisis inteligente
- Botón "Descargar Informe Word" para obtener el documento final

**Cada item de inspección permite:**
- Marcar: Cumple / Cumple Parcial / No Cumple / No Aplica
- Ver el criterio de verificación como guía
- Escribir una observación
- Adjuntar hasta 3 fotos (se comprimen automáticamente)

---

### 5. Informe Word Ejecutivo

El informe Word (.docx) incluye las siguientes secciones:

1. **Portada**: Título, copropiedad, fecha, director, auditor y porcentaje de cumplimiento general
2. **Resumen Ejecutivo (IA)**: Nivel de riesgo, resumen general
3. **Resultados por Sección**: Tabla con Cumple, Parcial, No Cumple, N/A y porcentaje por cada grupo
4. **Hallazgos Críticos (IA)**: Lista de problemas identificados
5. **Recomendaciones (IA)**: Acciones priorizadas por urgencia
6. **Detalle por Sección**: 7 tablas (Item | Criterio | Estado | Observación) con evidencia fotográfica
7. **Comentarios Generales**: Observaciones del auditor

---

### 6. Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
|-----------|-----------|-----------|
| Frontend | React 19 + TypeScript | Interfaz de usuario |
| Estilos | Tailwind CSS v4 | Diseño responsive mobile-first |
| Bundler | Vite 7 | Compilación y servidor de desarrollo |
| Informe | docx + file-saver | Generación del informe Word ejecutivo |
| IA | Google Gemini 2.0 Flash | Análisis inteligente de resultados |
| Fotos | IndexedDB (idb-keyval) | Almacenamiento de imágenes (>50MB) |
| Datos | localStorage | Persistencia del formulario (versionado v2) |
| PWA | vite-plugin-pwa | App instalable y offline |
| Iconos | Lucide React | Iconografía de la interfaz |

---

### 7. Instalación y Configuración

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

Los archivos se generan en la carpeta `dist/`.

---

### 7.1. Despliegue en Producción (Vercel)

La aplicación está desplegada en **Vercel** con integración continua desde GitHub.

| Recurso | URL |
|---------|-----|
| **Repositorio** | https://github.com/Jvasco1152/proyecto_JP |
| **Producción** | *(URL asignada por Vercel al hacer deploy)* |

#### Arquitectura de despliegue

```
┌─────────────────────────────────────────────┐
│                  Vercel                      │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  Frontend     │    │  /api/analyze    │   │
│  │  (dist/)      │    │  Serverless Fn   │   │
│  │  React SPA    │───>│  Proxy a Gemini  │   │
│  └──────────────┘    └────────┬─────────┘   │
│                               │              │
└───────────────────────────────┼──────────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Google Gemini API     │
                    │  (API key segura en    │
                    │   variables de entorno)│
                    └───────────────────────┘
```

#### Flujo de la API key (seguridad)

| Entorno | Método | API Key |
|---------|--------|---------|
| **Local** (`npm run dev`) | Llamada directa a Gemini desde el navegador | `VITE_GEMINI_API_KEY` en `.env.local` |
| **Producción** (Vercel) | Proxy via serverless function `/api/analyze` | `GEMINI_API_KEY` en variables de entorno de Vercel (nunca expuesta al cliente) |

#### Variables de entorno en Vercel

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `(API key de Google Gemini)` | Usada por la serverless function para llamar a Gemini de forma segura |

#### Despliegue continuo

Cada `git push` a la rama `main` dispara un nuevo deploy automático en Vercel:

```bash
# Hacer cambios, commitear y desplegar
git add .
git commit -m "descripción del cambio"
git push origin main
# Vercel despliega automáticamente en ~30 segundos
```

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

### 8. Estructura del Proyecto

```
proyecto_JP/
├── .env.local                         # API key local (NO se sube a git)
├── .gitignore                         # Archivos excluidos de git
├── index.html                         # HTML principal
├── package.json                       # Dependencias y scripts
├── vite.config.ts                     # Configuración de Vite + PWA
├── DOCUMENTO_PROYECTO.md              # Este documento
├── public/
│   └── icons/                         # Iconos de la PWA (SVG)
├── src/
│   ├── App.tsx                        # Componente raíz
│   ├── main.tsx                       # Punto de entrada
│   ├── index.css                      # Estilos globales (Tailwind)
│   ├── types/
│   │   └── inspection.ts             # Definiciones de tipos (v2: con cumple_parcial)
│   ├── data/
│   │   ├── directors.ts              # 28 directores
│   │   ├── auditors.ts              # 9 auditores
│   │   ├── copropiedades.ts         # ~220 copropiedades
│   │   └── inspectionSections.ts    # 17 items en 7 grupos (con criterios y frecuencia)
│   ├── components/
│   │   ├── wizard/                   # 10 pasos del formulario
│   │   │   ├── WizardLayout.tsx     # Layout principal con navegación
│   │   │   ├── StepHeader.tsx       # Paso 1: Datos generales
│   │   │   ├── StepInspectionGroup.tsx # Pasos 2-8: Componente genérico de inspección
│   │   │   ├── StepComentarios.tsx  # Paso 9: Comentarios
│   │   │   └── StepReview.tsx       # Paso 10: Revisión y generación
│   │   ├── inspection/               # Items y secciones
│   │   ├── ui/                       # Componentes reutilizables
│   │   └── report/
│   │       └── WordGenerator.ts     # Generador de informe Word ejecutivo
│   ├── hooks/                        # Lógica reutilizable
│   ├── services/
│   │   ├── aiService.ts             # Lógica de llamada a Gemini (dev/prod)
│   │   └── imageCompressor.ts       # Compresión de fotos
│   └── utils/
│       ├── calculateScores.ts       # Cálculo de puntajes (C=100, CP=50, NC=0)
│       ├── buildAIPrompt.ts         # Construcción del prompt para IA
│       └── reportStyles.ts          # Estilos y etiquetas para el informe
└── api/
    ├── analyze.ts                    # Serverless function (proxy a Gemini en Vercel)
    └── tsconfig.json                 # Configuración TS para serverless functions
```

---

### 9. Personalización

#### Agregar o modificar items de inspección
Editar el archivo `src/data/inspectionSections.ts`. Cada item tiene:
- `id`: Identificador único
- `label`: Texto descriptivo del item
- `criterio`: Criterio de verificación que guía al auditor
- `frecuencia`: Frecuencia recomendada de inspección
- `allowNA`: Si permite la opción "No Aplica"

#### Agregar directores o auditores
Editar `src/data/directors.ts` o `src/data/auditors.ts` agregando objetos con `name` y `email`.

#### Agregar copropiedades
Editar `src/data/copropiedades.ts` agregando nombres al array (se ordena alfabéticamente).

#### Modificar el diseño del informe Word
- Estilos y etiquetas: `src/utils/reportStyles.ts`
- Estructura y contenido: `src/components/report/WordGenerator.ts`

#### Modificar el prompt de IA
Editar `src/utils/buildAIPrompt.ts` para cambiar las instrucciones que recibe Gemini.

---

### 10. Características Técnicas Destacadas

- **Auto-guardado**: Los datos se guardan automáticamente cada 500ms. Si el usuario cierra la app o se queda sin batería, al reabrir todo está intacto.
- **Migración automática**: El sistema detecta datos de versiones anteriores (v1: 35 items) y los limpia automáticamente para evitar incompatibilidades.
- **Compresión de fotos**: Las imágenes se redimensionan a máximo 1200px de ancho y se comprimen a JPEG 70%, resultando en ~150KB por foto.
- **PWA instalable**: El usuario puede "instalar" la app desde el navegador en su celular y usarla como si fuera nativa.
- **Funciona offline**: Todo el formulario funciona sin internet. Solo se necesita conexión para el análisis con IA.
- **Mobile-first**: Diseñada prioritariamente para uso en celular durante las visitas de inspección.
- **Criterios de verificación**: Cada item muestra al auditor exactamente qué debe verificar, estandarizando las inspecciones.

---

### 11. Soporte y Mantenimiento

| Acción | Cómo hacerlo |
|--------|-------------|
| Actualizar dependencias | `npm update` |
| Verificar errores de tipos | `npx tsc --noEmit` |
| Compilar para producción | `npm run build` |
| Previsualizar build | `npm run preview` |
| Revisar código | `npm run lint` |

---

### 12. Seguridad

- **API key protegida en producción**: En Vercel, la API key de Gemini se almacena como variable de entorno del servidor y las llamadas se hacen a través de una serverless function (`/api/analyze`). La key nunca se expone en el código del cliente.
- **API key local**: En desarrollo, se usa `VITE_GEMINI_API_KEY` en `.env.local` (excluido de git por `.gitignore`).
- **Datos del usuario**: Las fotos y datos del formulario se almacenan únicamente en el dispositivo del usuario (IndexedDB y localStorage). No se envían a ningún servidor propio.
- **Datos enviados a IA**: Solo el texto de la inspección (sin fotos ni datos personales sensibles) se envía a Google Gemini para el análisis.
- **Repositorio**: El archivo `.env.local` y la carpeta `.claude/` están excluidos del repositorio.

---

### 13. Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| **v1.0** | Febrero 2026 | Lanzamiento inicial: 35 items, 3 secciones, 6 pasos, informe PDF |
| **v2.0** | Febrero 2026 | Nueva matriz: 17 items, 7 grupos, 10 pasos, informe Word ejecutivo, estado "Cumple Parcial", criterios de verificación |

---

### 14. Contacto y Repositorio

| Recurso | Enlace |
|---------|--------|
| **Código fuente** | https://github.com/Jvasco1152/proyecto_JP |
| **Hosting** | Vercel (despliegue automático desde GitHub) |

---

*Documento generado para el proyecto Auditor JP*
*Última actualización: Febrero 2026*
