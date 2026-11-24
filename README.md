# PDF Viewer

Visor de PDF para Windows y Linux basado en Electron.

## Estructura

- `src/main/`: proceso principal de Electron, ventanas, IPC y actualizaciones.
- `src/renderer/`: interfaz HTML, estilos y JavaScript del renderer.
- `assets/`: recursos compartidos de la aplicación.
- `scripts/`: scripts de instalación y utilidades.
- `.github/workflows/`: compilación y publicación automatizada.

## Desarrollo

```bash
npm install
npm start
```

## Compilación

```bash
npm run build:win
npm run build:linux
```
