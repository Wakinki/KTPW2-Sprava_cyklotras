// src/ui/views/ErrorView.js
export function ErrorView({ message, handlers }) {
  const container = document.createElement("div");
  container.className = "view-container error-view";

  const title = document.createElement("h1");
  title.textContent = "Chyba";
  container.appendChild(title);

  const messageElement = document.createElement("p");
  messageElement.textContent = message || "Došlo k neočekávané chybě";
  messageElement.className = "error-message";
  container.appendChild(messageElement);

  if (handlers?.onBackToDashboard) {
    const backButton = document.createElement("button");
    backButton.textContent = "Zpět na nástěnku";
    backButton.className = "btn btn-primary";
    backButton.onclick = handlers.onBackToDashboard;
    container.appendChild(backButton);
  }

  return container;
}