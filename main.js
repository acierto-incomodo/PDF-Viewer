const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
const Store = require("electron-store");

const store = new Store();

let mainWindow;
let settingsWindow;
let fileToOpen = null;

// Evitar múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

// Detectar archivo al iniciar (Windows / Linux)
if (process.argv.length >= 2) {
  const arg = process.argv[process.argv.length - 1];
  if (arg && arg.endsWith(".pdf")) {
    fileToOpen = arg;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    // Tamaño mínimo recomendado
    minWidth: 900,
    minHeight: 600,

    title: "PDF Viewer",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
      plugins: true,
    },
  });

  const template = [
    {
      label: "Inicio",
      accelerator: "CmdOrCtrl+H",
      click: () => {
        mainWindow.loadFile("index.html");
      },
    },
    {
      label: "Abrir PDF",
      accelerator: "CmdOrCtrl+O",
      click: () => {
        openFileDialog();
      },
    },
    {
      label: "Ajustes",
      click: openSettingsWindow,
    },
    { type: "separator" },
    {
      label: "Ver",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    { type: "separator" },
    { label: "Salir", role: "quit" },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.setMenuBarVisibility(true);
  mainWindow.setAutoHideMenuBar(false);

  mainWindow.loadFile("index.html");

  // Abrir PDF si viene desde fuera
  if (fileToOpen) {
    mainWindow.webContents.once("did-finish-load", () => {
      openPdfFile(fileToOpen);
    });
  }
}

function openSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    title: "Ajustes - PDF Viewer",
    parent: mainWindow,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  settingsWindow.setMenu(null);
  settingsWindow.loadFile("settings.html");
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

function normalizePath(p) {
  return path.resolve(p).toLowerCase();
}

function addToHistory(filePath) {
  let history = store.get("history", []);

  const normalized = normalizePath(filePath);
  const name = path.basename(filePath);

  // Eliminar duplicados reales (mejorado)
  history = history.filter((item) => normalizePath(item.path) !== normalized);

  // Añadir al principio
  history.unshift({ name, path: filePath });

  // Limitar a 10
  store.set("history", history.slice(0, 10));
}

ipcMain.handle("get-history", () => store.get("history", []));

ipcMain.handle("remove-history-item", (event, filePath) => {
  const history = store.get("history", []);
  const normalized = normalizePath(filePath);
  const updatedHistory = history.filter(
    (item) => normalizePath(item.path) !== normalized,
  );
  store.set("history", updatedHistory);
  return updatedHistory;
});

ipcMain.handle("clear-history", () => {
  store.set("history", []);
  return [];
});

ipcMain.handle("get-pdf-open-mode", () =>
  store.get("openPdfsInNewWindows", false),
);

ipcMain.handle("set-pdf-open-mode", (event, openInNewWindows) => {
  const value = openInNewWindows === true;
  store.set("openPdfsInNewWindows", value);
  return value;
});

ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Documentos PDF", extensions: ["pdf"] }],
  });
  return result;
});

ipcMain.on("open-pdf", (event, filePath) => {
  openPdfFile(filePath, false);
});

function openPdfFile(
  filePath,
  openInNewWindow = store.get("openPdfsInNewWindows", false),
) {
  addToHistory(filePath);

  if (openInNewWindow) {
    const pdfWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,
      title: `Visualizando: ${path.basename(filePath)}`,
      icon: path.join(__dirname, "icon.png"),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });
    pdfWindow.loadURL(pathToFileURL(filePath).toString());
    return;
  }

  mainWindow.loadURL(pathToFileURL(filePath).toString());
  mainWindow.setTitle(`Visualizando: ${path.basename(filePath)}`);
  mainWindow.maximize();
  mainWindow.focus();
}

function openFileDialog() {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Documentos PDF", extensions: ["pdf"] }],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        openPdfFile(result.filePaths[0], false);
      }
    })
    .catch((err) => {
      console.error("Error al abrir el archivo:", err);
    });
}

// Cuando ya está abierta la app y abres otro PDF
app.on("second-instance", (event, commandLine) => {
  const file = commandLine.find((arg) => arg.endsWith(".pdf"));
  if (file && mainWindow) {
    openPdfFile(file);
  }
});

// App lista
app.whenReady().then(() => {
  // Registrar como visor de PDFs
  app.setAsDefaultProtocolClient("pdf");

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
