// src/ui/views/DashboardView.js
export function DashboardView({ viewState, handlers }) {
  const { role, summary, capabilities } = viewState;

  const container = document.createElement("div");
  container.className = "view-container dashboard-view";

  const title = document.createElement("h1");
  title.textContent = "Nástěnka";
  container.appendChild(title);

  const welcome = document.createElement("p");
  welcome.textContent = `Přihlášen jako: ${role}`;
  welcome.className = "welcome-message";
  container.appendChild(welcome);

  // Statistiky podle role
  if (summary) {
    const statsSection = document.createElement("div");
    statsSection.className = "stats-section";

    const statsTitle = document.createElement("h2");
    statsTitle.textContent = role === "MAINTAINER" ? "Moje statistiky" : "Statistiky systému";
    statsSection.appendChild(statsTitle);

    const statsContainer = document.createElement("div");
    statsContainer.className = "stats-container";

    if (role === "MAINTAINER") {
      const routesStats = document.createElement("div");
      routesStats.className = "stat-card";
      routesStats.innerHTML = `
        <h3>Moje trasy</h3>
        <p>Celkem: ${summary.myRoutesCount || 0}</p>
        <ul>
          <li>Koncepty: ${summary.draftRoutesCount || 0}</li>
          <li>Navržené: ${summary.proposedRoutesCount || 0}</li>
          <li>Vyznačené: ${summary.signedRoutesCount || 0}</li>
          <li>Implementované: ${summary.implementedRoutesCount || 0}</li>
        </ul>
      `;
      statsContainer.appendChild(routesStats);

      const signsStats = document.createElement("div");
      signsStats.className = "stat-card";
      signsStats.innerHTML = `
        <h3>Moje značky</h3>
        <p>Celkem: ${summary.mySignsCount || 0}</p>
        <ul>
          <li>Koncepty: ${summary.draftedSignsCount || 0}</li>
          <li>Navržené: ${summary.proposedSignsCount || 0}</li>
          <li>Potvrzené: ${summary.okSignsCount || 0}</li>
          <li>Stržené: ${summary.tornDownSignsCount || 0}</li>
        </ul>
      `;
      statsContainer.appendChild(signsStats);
    } else if (role === "ADMINISTRATOR") {
      const routesStats = document.createElement("div");
      routesStats.className = "stat-card";
      routesStats.innerHTML = `
        <h3>Trasy v systému</h3>
        <p>Celkem: ${(summary.draftRoutesCount || 0) + (summary.proposedRoutesCount || 0) + (summary.signedRoutesCount || 0) + (summary.implementedRoutesCount || 0)}</p>
        <ul>
          <li>Koncepty: ${summary.draftRoutesCount || 0}</li>
          <li>Navržené: ${summary.proposedRoutesCount || 0}</li>
          <li>Vyznačené: ${summary.signedRoutesCount || 0}</li>
          <li>Implementované: ${summary.implementedRoutesCount || 0}</li>
        </ul>
      `;
      statsContainer.appendChild(routesStats);

      const signsStats = document.createElement("div");
      signsStats.className = "stat-card";
      signsStats.innerHTML = `
        <h3>Značky v systému</h3>
        <p>Celkem: ${(summary.draftedSignsCount || 0) + (summary.proposedSignsCount || 0) + (summary.canceledSignsCount || 0) + (summary.okSignsCount || 0) + (summary.tornDownSignsCount || 0)}</p>
        <ul>
          <li>Koncepty: ${summary.draftedSignsCount || 0}</li>
          <li>Navržené: ${summary.proposedSignsCount || 0}</li>
          <li>Zrušené: ${summary.canceledSignsCount || 0}</li>
          <li>Potvrzené: ${summary.okSignsCount || 0}</li>
          <li>Stržené: ${summary.tornDownSignsCount || 0}</li>
        </ul>
      `;
      statsContainer.appendChild(signsStats);
    }

    statsSection.appendChild(statsContainer);
    container.appendChild(statsSection);
  }

  // Rychlé odkazy
  const quickLinks = document.createElement("div");
  quickLinks.className = "quick-links";

  if (capabilities?.canEnterRouteList) {
    const routesButton = document.createElement("button");
    routesButton.textContent = "Zobrazit všechny trasy";
    routesButton.className = "btn btn-primary";
    routesButton.onclick = handlers.onEnterRouteList;
    quickLinks.appendChild(routesButton);
  }

  container.appendChild(quickLinks);
  return container;
}