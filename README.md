# Bienvenidos a NSB

Esta documentación está destinada a los desarrolladores interesados en colaborar, mejorar y mantener la aplicación NSB.

## Descripción del Proyecto

NSB es una aplicación desarrollada en React que tiene como objetivo optimizar el tiempo en la verificación de la creación de artículos en los proyectos de Purina, Nutrition y Profesional. Este proyecto sigue una arquitectura modular, diseñada para facilitar tanto la escalabilidad como la reutilización de componentes.

## Estructura de Carpetas

La estructura del proyecto está organizada de manera modular y reusable, facilitando el mantenimiento y la escalabilidad de la aplicación:

**Pages:** Contiene las páginas accesibles desde las rutas principales con las que el usuario interactúa directamente, como la pantalla de inicio. Cada página puede tener subcarpetas si hay subpáginas relacionadas.

**Modules:** Incluye componentes complejos que forman las vistas de la aplicación. Estos módulos encapsulan funcionalidades específicas, y pueden consistir en múltiples componentes y servicios.

**Components:** Almacena todos los componentes reutilizables a nivel global de la aplicación, como inputs, formularios y tablas. Dentro de esta carpeta, se recomienda crear subcarpetas dentro de "ui" para los componentes más pequeños y reutilizables.

**Hooks:** Contiene hooks personalizados, facilitando su reutilización y mantenimiento en diferentes partes de la aplicación.

**Utils:** Aquí se encuentran las funciones utilitarias que pueden ser utilizadas en diversas partes de la aplicación, promoviendo la reutilización de código.

**Assets:** Almacena todos los recursos de la aplicación, como estilos (CSS/SASS) e imágenes.

## Librerías y Herramientas Utilizadas

La aplicación utiliza diversas librerías para manejar diferentes aspectos de su funcionalidad. A continuación se presenta una lista de las principales:

- **Node v20.10.0:** Entorno de ejecución para JavaScript en el lado del servidor.
- **React v18.2.0:** Biblioteca para la construcción de interfaces de usuario.
- **Vite v5.1.0:** Herramienta de desarrollo y construcción rápida para proyectos web modernos.
- **Axios v1.6.7:** Cliente HTTP basado en promesas para el navegador y Node.js.
- **React Bootstrap v2.10.1:** Componentes de Bootstrap para React, basado en Bootstrap v5.3.3.
- **Cheerio v1.0.0-rc.12:** Biblioteca rápida y flexible para analizar y manipular HTML.
- **React-json-view v1.21.3:** Componente de React para visualizar y editar datos JSON.
- **Express v4.18.3:** Framework web rápido, minimalista y flexible para Node.js.
- **Http proxy middleware v2.0.6:** Middleware para configurar proxies en aplicaciones Node.js.
- **Mammoth v1.7.2:** Herramienta para convertir documentos DOCX a HTML sin perder la semántica.
- **Fortawesome v6.5.2:** Conjunto de iconos vectoriales y herramientas relacionadas.
- **Cors v2.8.5:** Middleware para habilitar CORS (Cross-Origin Resource Sharing) en aplicaciones Express.
- **Diff-match-patch v1.0.5:** Biblioteca para comparar y parchear texto.
- **Dompurify v3.1.6:** Biblioteca para limpiar HTML y prevenir ataques XSS.
- **Htmlparser2 v9.1.0:** Biblioteca rápida y flexible para analizar HTML y XML.
- **Marked v13.0.2:** Analizador y compilador de Markdown, rápido y eficiente.
