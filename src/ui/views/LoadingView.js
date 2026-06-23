// src/ui/views/LoadingView.js
export function LoadingView() {
  const container = document.createElement("div");
  container.className = "view-container loading-view";

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinner.textContent = "Načítání...";

  container.appendChild(spinner);
  return container;
}