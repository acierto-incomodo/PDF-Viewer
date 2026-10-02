const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getHistory: () => ipcRenderer.invoke("get-history"),
  removeHistoryItem: (filePath) =>
    ipcRenderer.invoke("remove-history-item", filePath),
  clearHistory: () => ipcRenderer.invoke("clear-history"),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  openPDF: (filePath) => ipcRenderer.send("open-pdf", filePath),
});
