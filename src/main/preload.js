const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getHistory: () => ipcRenderer.invoke("get-history"),
  removeHistoryItem: (filePath) =>
    ipcRenderer.invoke("remove-history-item", filePath),
  clearHistory: () => ipcRenderer.invoke("clear-history"),
  getPdfOpenMode: () => ipcRenderer.invoke("get-pdf-open-mode"),
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  setPdfOpenMode: (openInNewWindows) =>
    ipcRenderer.invoke("set-pdf-open-mode", openInNewWindows),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  openPDF: (filePath) => ipcRenderer.send("open-pdf", filePath),
});
