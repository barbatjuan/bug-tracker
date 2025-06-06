# Bug Tracker

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_DEPLOY_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

Una aplicación de seguimiento de errores (bug tracker) construida con React, TypeScript, Vite y Tailwind CSS.

## Características

- 🎨 Interfaz de usuario moderna y responsiva
- 🔐 Autenticación de usuarios
- 📋 Gestión de proyectos y módulos
- 🐛 Seguimiento de tickets de errores
- 📊 Agrupación de tickets por módulo
- 👥 Gestión de usuarios y permisos
- 🌓 Modo claro/oscuro

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/barbatjuan/bug-tracker.git
   cd bug-tracker
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

## Estructura del Proyecto

```
src/
├── components/     # Componentes de React
├── hooks/         # Custom Hooks
├── types/         # Definiciones de tipos TypeScript
├── utils/         # Utilidades y helpers
├── App.tsx        # Componente principal
└── main.tsx       # Punto de entrada
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Netlify con cada push a la rama `main`.

## GitHub Actions

Hemos configurado GitHub Actions para:
- Ejecutar pruebas automatizadas en cada push/pull request
- Verificar el formato del código con ESLint y Prettier
- Construir la aplicación para producción

## Licencia

MIT

---

Desarrollado por [Tu Nombre](https://github.com/barbatjuan)
