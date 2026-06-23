// src/ui/views/RouteListView.js
export function RouteListView({ viewState, handlers }) {
  const { routes, capabilities } = viewState;
  const container = document.createElement("div");
  container.className = "view-container route-list-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = "Seznam cyklistických tras";
  header.appendChild(title);

  if (capabilities?.canCreateRoute) {
    const createButton = document.createElement("button");
    createButton.textContent = "Vytvořit novou trasu";
    createButton.className = "btn btn-primary";
    createButton.onclick = handlers.onCreateRoute;
    header.appendChild(createButton);
  }

  container.appendChild(header);

  if (routes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Žádné trasy k zobrazení.";
    emptyMessage.className = "empty-message";
    container.appendChild(emptyMessage);
  } else {
    const table = document.createElement("table");
    table.className = "data-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Název", "Délka", "Obtížnost", "Stav", "Akce"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    routes.forEach((route) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = route.name;
      row.appendChild(nameCell);

      const lengthCell = document.createElement("td");
      lengthCell.textContent = `${route.lengthKm} km`;
      row.appendChild(lengthCell);

      const difficultyCell = document.createElement("td");
      difficultyCell.textContent = route.difficulty;
      row.appendChild(difficultyCell);

      const stateCell = document.createElement("td");
      const stateBadge = document.createElement("span");
      stateBadge.textContent = route.state;
      stateBadge.className = `state-badge state-${route.state.toLowerCase().replace("_", "-")}`;
      stateCell.appendChild(stateBadge);
      row.appendChild(stateCell);

      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";

      const detailButton = document.createElement("button");
      detailButton.textContent = "Detail";
      detailButton.className = "btn btn-small btn-info";
      detailButton.onclick = () => handlers.onEnterRouteDetail({ routeId: route.id });
      actionsCell.appendChild(detailButton);

      if (capabilities?.canEnterAdministration) {
        const adminButton = document.createElement("button");
        adminButton.textContent = "Spravovat";
        adminButton.className = "btn btn-small btn-secondary";
        adminButton.onclick = () => handlers.onEnterRouteAdministration({ routeId: route.id });
        actionsCell.appendChild(adminButton);
      }

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  if (capabilities?.canEnterSignList) {
    const signsLink = document.createElement("div");
    signsLink.className = "related-links";
    const link = document.createElement("a");
    link.href = "#/signs";
    link.textContent = "→ Zobrazit všechny značky";
    link.onclick = (e) => {
      e.preventDefault();
      handlers.onEnterSignList();
    };
    signsLink.appendChild(link);
    container.appendChild(signsLink);
  }

  return container;
}