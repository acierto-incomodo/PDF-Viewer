const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getHistory: () => ipcRenderer.invoke("get-history"),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  openPDF: (filePath) => ipcRenderer.send("open-pdf", filePath),
});
