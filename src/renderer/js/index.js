const grid = document.getElementById("grid");
const openBtn = document.getElementById("openBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

async function renderHistory() {
  const history = await window.electronAPI.getHistory();
  clearHistoryBtn.hidden = history.length === 0;
  grid.replaceChildren();

  if (history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Tu historial aparecerá aquí cuando abras un archivo.";
    grid.append(empty);
    return;
  }

  for (const item of history) {
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener("click", () => openFile(item.path));

    const name = document.createElement("span");
    name.className = "card-name";
    name.textContent = item.name;

    const filePath = document.createElement("span");
    filePath.className = "card-path";
    filePath.textContent = item.path;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-card";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Eliminar ${item.name} del historial`);
    removeButton.title = "Eliminar del historial";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      await window.electronAPI.removeHistoryItem(item.path);
      renderHistory();
    });

    card.append(removeButton, name, filePath);
    grid.append(card);
  }
}

function openFile(filePath) {
  window.electronAPI.openPDF(filePath);
}

openBtn.addEventListener("click", async () => {
  const result = await window.electronAPI.openFileDialog();
  if (!result.canceled && result.filePaths.length > 0) {
    openFile(result.filePaths[0]);
  }
});

clearHistoryBtn.addEventListener("click", async () => {
  await window.electronAPI.clearHistory();
  renderHistory();
});

renderHistory();
