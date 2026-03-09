# Banco Impulso - Portafolio M06L05 (Versión Vue.js)

### 📌 Descripción del Proyecto
Este proyecto representa la evolución tecnológica de la plataforma financiera de **La Tribu**. Hemos migrado toda la lógica anterior de jQuery a **Vue.js 3**, transformando el sitio en una Single Page Application (SPA). Ahora el contenido es reactivo, lo que significa que los datos se actualizan instantáneamente según el usuario que inicie sesión, sin necesidad de refrescar el navegador.

### ⚙️ Tecnologías Utilizadas
- **Vue.js 3** (Framework principal para la reactividad).
- **Vue Router 4** (Para la navegación entre secciones sin recarga).
- **HTML5** (Semántico, con etiquetas de lenguaje es-Cl).
- **SASS** (Arquitectura profesional de carpetas y metodología BEM).
- **Bootstrap 5.3** (Diseño responsivo y componentes Offcanvas).
- **API Mindicador.cl** (Conexión asíncrona mediante Fetch API).

### 🚀 Instalación y Uso
1. Descarga la carpeta del proyecto.
2. Abre la carpeta en Visual Studio Code.
3. Si vas a modificar estilos, asegúrate de correr el compilador de SASS (ej: `sass scss/main.scss css/main.css --watch`).
4. Ejecuta el archivo `index.html` usando la extensión **Live Server**.
5. Al ingresar, el sistema te pedirá tu nombre. Prueba con **Andrés** o **Estefanía** para ver cómo cambian los datos y las tablas de movimientos.

### ✅ Checklist de Entrega
- [x] Se utiliza Vue.js 3 y Vue Router 4 mediante CDN.
- [x] La navegación se realiza mediante `<router-view>` y `<router-link>`.
- [x] El diseño es Mobile First y mantiene la estética original de Banco Impulso.
- [x] Los estilos están organizados en carpetas SASS (abstracts, base, layout, pages).
- [x] El archivo JavaScript se llama `app.js` y el CSS `main.css`.
- [x] Se implementó `v-cloak` para evitar el parpadeo de llaves al cargar.

### 💡 Notas importantes
He integrado la tabla de movimientos directamente en la vista principal para mejorar la experiencia de usuario (UX), permitiendo que el cliente vea su resumen financiero y sus transacciones de un solo vistazo. La base de datos es dinámica y responde al usuario que se encuentre logueado en el computador.