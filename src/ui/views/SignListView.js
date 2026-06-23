// src/ui/views/SignListView.js
export function SignListView({ viewState, handlers }) {
  const { signs, capabilities } = viewState;
  console.log(capabilities)

  const container = document.createElement("div");
  container.className = "view-container sign-list-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = "Seznam značek";
  header.appendChild(title);

  if (capabilities?.canCreateSign) {
    const createButton = document.createElement("button");
    createButton.textContent = "Vytvořit novou značku";
    createButton.className = "btn btn-primary";
    createButton.onclick = handlers.onCreateSign;
    header.appendChild(createButton);
  }

  container.appendChild(header);

  if (signs.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Žádné značky k zobrazení.";
    emptyMessage.className = "empty-message";
    container.appendChild(emptyMessage);
  } else {
    const table = document.createElement("table");
    table.className = "data-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["ID", "Trasa", "Poloha", "Směr", "Typ", "Stav", "Akce"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    signs.forEach((sign) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = sign.id;
      row.appendChild(idCell);

      const routeCell = document.createElement("td");
      routeCell.textContent = sign.routeId;
      row.appendChild(routeCell);

      const locationCell = document.createElement("td");
      locationCell.textContent = `${sign.location.lat}, ${sign.location.lng}`;
      row.appendChild(locationCell);

      const directionCell = document.createElement("td");
      directionCell.textContent = sign.direction;
      row.appendChild(directionCell);

      const typeCell = document.createElement("td");
      typeCell.textContent = sign.type || "NORMAL";
      row.appendChild(typeCell);

      const stateCell = document.createElement("td");
      const stateBadge = document.createElement("span");
      stateBadge.textContent = sign.state;
      stateBadge.className = `state-badge state-${sign.state.toLowerCase().replace("_", "-")}`;
      stateCell.appendChild(stateBadge);
      row.appendChild(stateCell);

      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";

      const detailButton = document.createElement("button");
      detailButton.textContent = "Detail";
      detailButton.className = "btn btn-small btn-info";
      detailButton.onclick = () => handlers.onEnterSignDetail({ signId: sign.id });
      actionsCell.appendChild(detailButton);

      if (capabilities?.canEnterAdministration) {
        const adminButton = document.createElement("button");
        adminButton.textContent = "Spravovat";
        adminButton.className = "btn btn-small btn-secondary";
        adminButton.onclick = () => handlers.onEnterSignAdministration({ signId: sign.id });
        actionsCell.appendChild(adminButton);
      }

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  if (capabilities?.canEnterRouteList) {
    const routesLink = document.createElement("div");
    routesLink.className = "related-links";
    const link = document.createElement("a");
    link.href = "#/routes";
    link.textContent = "→ Zobrazit všechny trasy";
    link.onclick = (e) => {
      e.preventDefault();
      handlers.onEnterRouteList();
    };
    routesLink.appendChild(link);
    container.appendChild(routesLink);
  }

  return container;
}