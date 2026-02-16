# Nébula Sur

Frontend en React + Vite listo para despliegue estático en Netlify.

## Requisitos

- Node.js 22 (recomendado)
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

El resultado se genera en `dist/`.

## Deploy en Netlify

Este repositorio ya incluye `netlify.toml` con:

- Comando de build: `npm run build`
- Carpeta publicada: `dist`
- Redirect SPA: `/* -> /index.html` (status 200)

Pasos:

1. Sube este repo a GitHub/GitLab/Bitbucket.
2. En Netlify, crea un sitio con **Add new site > Import an existing project**.
3. Selecciona el repositorio y despliega.

Netlify detectará automáticamente la configuración del archivo `netlify.toml`.
