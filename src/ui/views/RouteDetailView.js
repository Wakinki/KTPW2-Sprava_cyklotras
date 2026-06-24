// src/ui/views/RouteDetailView.js
export function RouteDetailView({ viewState, handlers }) {
  const { route, signs, capabilities } = viewState;

  if (!route) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = "Trasa nebyla nalezena.";
    return error;
  }

  const container = document.createElement("div");
  container.className = "view-container route-detail-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = route.name;
  header.appendChild(title);

  const backButton = document.createElement("button");
  backButton.textContent = "← Zpět na seznam";
  backButton.className = "btn btn-secondary";
  backButton.onclick = handlers.onBackToList;
  header.appendChild(backButton);

  container.appendChild(header);

  // Základní informace o trase
  const routeInfo = document.createElement("div");
  routeInfo.className = "entity-info";

  const infoTitle = document.createElement("h2");
  infoTitle.textContent = "Základní informace";
  routeInfo.appendChild(infoTitle);

  const infoTable = document.createElement("table");
  infoTable.className = "info-table";

  const infoData = [
    ["Popis", route.description || "Žádný popis"],
    ["Stav", ``],
    ["Vytvořil", `${route.createdBy} (${route.createdAt})`],
  ];

  if (route.proposedAt) infoData.push(["Navrženo", `${route.proposedBy} (${route.proposedAt})`]);
  if (route.signedAt) infoData.push(["Podepsáno", `${route.signedBy} (${route.signedAt})`]);
  if (route.implementedAt) infoData.push(["Implementováno", `${route.implementedBy} (${route.implementedAt})`]);

  infoData.forEach(([label, value]) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.textContent = label;
    row.appendChild(labelCell);

    const valueCell = document.createElement("td");
    if (label === "Stav") {
      const stateBadge = document.createElement("span");
      stateBadge.textContent = route.state;
      stateBadge.className = `state-badge state-${route.state.toLowerCase().replace("_", "-")}`;
      valueCell.appendChild(stateBadge);
    } else {
      valueCell.textContent = value;
    }
    row.appendChild(valueCell);
    infoTable.appendChild(row);
  });

  routeInfo.appendChild(infoTable);
  container.appendChild(routeInfo);

  // Značky na této trase
  if (signs && signs.length > 0) {
    const signsSection = document.createElement("div");
    signsSection.className = "route-signs-section";

    const signsTitle = document.createElement("h2");
    signsTitle.textContent = `Značky na této trase (${signs.length})`;
    signsSection.appendChild(signsTitle);

    const signsList = document.createElement("div");
    signsList.className = "signs-in-route-list";

    signs.forEach((sign) => {
      const signItem = document.createElement("div");
      signItem.className = "sign-in-route-item";

      const signInfo = document.createElement("div");
      signInfo.innerHTML = `
        <p><strong>ID:</strong> ${sign.id}</p>
        <p><strong>Poloha:</strong> ${sign.location.lat}, ${sign.location.lng}</p>
        <p><strong>Směr:</strong> ${sign.direction}</p>
        <p><strong>Typ:</strong> ${sign.type || "NORMAL"}</p>
        <p><strong>Stav:</strong> <span class="state-badge state-${sign.state.toLowerCase().replace("_", "-")}">${sign.state}</span></p>
      `;
      signItem.appendChild(signInfo);

      const detailButton = document.createElement("button");
      detailButton.textContent = "Detail značky";
      detailButton.className = "btn btn-small btn-info";
      detailButton.onclick = () => handlers.onEnterSignDetail({ signId: sign.id });
      signItem.appendChild(detailButton);

      signsList.appendChild(signItem);
    });

    signsSection.appendChild(signsList);
    container.appendChild(signsSection);
  }

  // Akční tlačítka
  if (capabilities) {
    const actionsSection = document.createElement("div");
    actionsSection.className = "entity-actions";

    if (capabilities?.canCreateSign) {
    const createSignSection = document.createElement("div");
    createSignSection.className = "create-sign-section";

    const createButton = document.createElement("button");
    createButton.textContent = "Přidat značku k této trase";
    createButton.className = "btn btn-primary";
    createButton.onclick = () => handlers.onCreateSign(route.id);
    createSignSection.appendChild(createButton);

    container.appendChild(createSignSection);
  }

    if (capabilities.canEnterAdministration) {
      const adminButton = document.createElement("button");
      adminButton.textContent = "Spravovat trasu";
      adminButton.className = "btn btn-secondary";
      adminButton.onclick = () => handlers.onEnterRouteAdministration({ routeId: route.id });
      actionsSection.appendChild(adminButton);
    }

    if (capabilities.canPropose) {
      const proposeButton = document.createElement("button");
      proposeButton.textContent = "Navrhnout k schválení";
      proposeButton.className = "btn btn-primary";
      proposeButton.onclick = () => handlers.onProposeRoute({ routeId: route.id });
      actionsSection.appendChild(proposeButton);
    }

    if (capabilities.canSign) {
      const signButton = document.createElement("button");
      signButton.textContent = "Vyznačit trasu";
      signButton.className = "btn btn-success";
      signButton.onclick = () => handlers.onSignRoute({ routeId: route.id });
      actionsSection.appendChild(signButton);
    }

    if (capabilities.canImplement) {
      const implementButton = document.createElement("button");
      implementButton.textContent = "Implementovat trasu";
      implementButton.className = "btn btn-success";
      implementButton.onclick = () => handlers.onImplementRoute({ routeId: route.id });
      actionsSection.appendChild(implementButton);
    }

    container.appendChild(actionsSection);
  }

  return container;
}