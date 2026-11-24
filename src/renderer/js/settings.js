const modeOptions = document.querySelectorAll('input[name="pdf-open-mode"]');
const saveStatus = document.getElementById("saveStatus");
const saveStatusMessage = document.getElementById("saveStatusMessage");
const saveStatusProgress = document.getElementById("saveStatusProgress");
const appVersion = document.getElementById("appVersion");
let saveStatusTimeout;

window.electronAPI.getAppVersion().then((version) => {
  appVersion.textContent = version;
});

window.electronAPI.getPdfOpenMode().then((openInNewWindows) => {
  const value = openInNewWindows ? "new" : "same";
  document.querySelector(`input[value="${value}"]`).checked = true;
});

modeOptions.forEach((option) => {
  option.addEventListener("change", async () => {
    await window.electronAPI.setPdfOpenMode(option.value === "new");
    clearTimeout(saveStatusTimeout);
    saveStatus.classList.remove("is-visible");
    saveStatusProgress.style.animation = "none";
    void saveStatusProgress.offsetWidth;
    saveStatusProgress.style.animation = "";
    saveStatusMessage.textContent = "Cambios guardados";
    saveStatus.classList.add("is-visible");
    saveStatusTimeout = setTimeout(() => {
      saveStatus.classList.remove("is-visible");
      saveStatusMessage.textContent = "";
    }, 2500);
  });
});
