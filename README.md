# izzi-ux-core

**izzi-ux-core** es un rediseño en su maximo esplendor para el sitio publico de izzi, pueden encontrar el desarrollo de aplicaciones frontend enfocada en experiencia de usuario (UX), componibilidad y rápida integración con CMS/headless commerce. El proyecto utiliza tecnologías actuales como Next.js 15, React 19, TailwindCSS 4 y Contentful.

---

## 🚀 Tecnologías principales

- **Next.js 15** – Framework React para apps escalables, SSR, SSG y rutas modernas.
- **React 19** – Última versión con nuevas features y optimizaciones.
- **TailwindCSS 4** – Estilizado rápido y responsivo basado en utilidades.
- **Contentful** – Headless CMS para manejo flexible de contenido.
- **Framer Motion** – Animaciones avanzadas para una experiencia fluida.
- **Jest & React Testing Library** – Pruebas unitarias y de componentes.
- **TypeScript** – Código seguro y mantenible.

---

## 📁 Estructura de carpetas

```plaintext
src/
├── app/             # Entrypoint, rutas y layouts principales (Next.js)
│   ├── api/         # Endpoints internos (API routes)
│   ├── favicon.ico
│   ├── layout.tsx
│   └── page.tsx
├── components/      # Componentes UI (Atomic Design)
│   ├── atoms/
│   ├── layouts/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── config/          # Configuraciones generales del proyecto
├── constants/       # Constantes globales y reutilizables
├── hooks/           # Custom hooks de React
├── lib/             # Librerías y utilidades compartidas
├── services/        # Lógica de servicios y APIs externas
│   └── contentful/  # Integración con Contentful
├── styles/          # Archivos de estilos globales
├── types/           # Definiciones y tipos de TypeScript
├── utils/           # Utilidades y helpers
├── tests/           # Pruebas unitarias

```
---

## Instalación y uso local

## 🛠️ Instalación y uso local

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/izzi-ux-core.git
    cd izzi-ux-core
    ```

2. **Instala las dependencias:**
    ```bash
    npm install
    ```

3. **Configura las variables de entorno:**
    - Copia el archivo `.env.template` y renómbralo a `.env`
    - Completa las variables necesarias (ejemplo: credenciales de Contentful)

4. **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 📋 Scripts principales

- `npm run dev` – Inicia el entorno de desarrollo.
- `npm run build` – Compila la app para producción.
- `npm start` – Ejecuta la app en modo producción.
- `npm run test` – Ejecuta las pruebas unitarias.
- `npm run test:watch` – Ejecuta pruebas en modo watch.
- `npm run lint` – Ejecuta el linter sobre el código.

## 🧪 Ejecución de pruebas unitarias

Las pruebas se encuentran en la carpeta `/tests` y se ejecutan con **Jest** y **React Testing Library**.

Para correr los tests una vez:

```bash
npm run test
```
Para correr en modo watch (útil durante desarrollo):
```bash
npm run test:watch
```

---

## 📖 Notas adicionales

- Los componentes están organizados siguiendo **Atomic Design** para máxima reutilización.
- Integración lista para conectar con Contentful y otros servicios headless.
- Puedes extender la configuración añadiendo herramientas como Storybook, Cypress, etc.

