// src/ui/views/SignDetailView.js
export function SignDetailView({ viewState, handlers }) {
  const { sign, route, capabilities } = viewState;

  if (!sign) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = "Značka nebyla nalezena.";
    return error;
  }

  

  const container = document.createElement("div");
  container.className = "view-container sign-detail-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = `Značka: ${sign.id}`;
  header.appendChild(title);

  const backButton = document.createElement("button");
  backButton.textContent = "← Zpět na seznam";
  backButton.className = "btn btn-secondary";
  backButton.onclick = handlers.onBackToList;
  header.appendChild(backButton);

  container.appendChild(header);

  // Základní informace
  const signInfo = document.createElement("div");
  signInfo.className = "entity-info";

  const infoTitle = document.createElement("h2");
  infoTitle.textContent = "Základní informace";
  signInfo.appendChild(infoTitle);

  const infoTable = document.createElement("table");
  infoTable.className = "info-table";

  const infoData = [
    ["ID", sign.id],
    ["Trasa", route ? route.name : sign.routeId],
    ["Poloha (lat, lng)", `${sign.location.lat}, ${sign.location.lng}`],
    ["Směr", sign.direction],
    ["Typ", sign.type || "NORMAL"],
    ["Stav", ``],
    ["Vytvořil", `${sign.createdBy} (${sign.createdAt})`],
  ];

  if (sign.proposedAt) infoData.push(["Navrženo", `${sign.proposedBy} (${sign.proposedAt})`]);
  if (sign.confirmedAt) infoData.push(["Potvrzeno", `${sign.confirmedBy} (${sign.confirmedAt})`]);
  if (sign.canceledAt) infoData.push(["Zrušeno", `${sign.canceledBy} (${sign.canceledAt})`]);
  if (sign.tornDownAt) infoData.push(["Strženo", sign.tornDownAt]);
  if (sign.repairedAt) infoData.push(["Opraveno", `${sign.repairedBy} (${sign.repairedAt})`]);

  infoData.forEach(([label, value]) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.textContent = label;
    row.appendChild(labelCell);

    const valueCell = document.createElement("td");
    if (label === "Stav") {
      const stateBadge = document.createElement("span");
      stateBadge.textContent = sign.state;
      stateBadge.className = `state-badge state-${sign.state.toLowerCase().replace("_", "-")}`;
      valueCell.appendChild(stateBadge);
    } else {
      valueCell.textContent = value;
    }
    row.appendChild(valueCell);
    infoTable.appendChild(row);
  });

  signInfo.appendChild(infoTable);
  container.appendChild(signInfo);

  // Akční tlačítka
  if (capabilities) {
    const actionsSection = document.createElement("div");
    actionsSection.className = "entity-actions";

     if (route) {
      const backToRouteButton = document.createElement("button");
      backToRouteButton.textContent = "Zpět k trase";
      backToRouteButton.className = "btn btn-secondary";
      backToRouteButton.onclick = () => handlers.onBackToRouteDetail({ routeId: route.id });
      actionsSection.appendChild(backToRouteButton);
    }

    if (capabilities.canEnterAdministration) {
      const adminButton = document.createElement("button");
      adminButton.textContent = "Spravovat značku";
      adminButton.className = "btn btn-secondary";
      adminButton.onclick = () => handlers.onEnterSignAdministration({ signId: sign.id });
      actionsSection.appendChild(adminButton);
    }

    if (capabilities.canPropose) {
      const proposeButton = document.createElement("button");
      proposeButton.textContent = "Navrhnout k schválení";
      proposeButton.className = "btn btn-primary";
      proposeButton.onclick = () => handlers.onProposeSign({ signId: sign.id });
      actionsSection.appendChild(proposeButton);
    }

    if (capabilities.canConfirm) {
      const confirmButton = document.createElement("button");
      confirmButton.textContent = "Potvrdit značku";
      confirmButton.className = "btn btn-success";
      confirmButton.onclick = () => handlers.onConfirmSign({ signId: sign.id });
      actionsSection.appendChild(confirmButton);
    }

    if (capabilities.canCancel) {
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Zrušit značku";
      cancelButton.className = "btn btn-warning";
      cancelButton.onclick = () => handlers.onCancelSign({ signId: sign.id });
      actionsSection.appendChild(cancelButton);
    }

    if (capabilities.canReportTornDown) {
      const tornDownButton = document.createElement("button");
      tornDownButton.textContent = "Nahlásit jako strženou";
      tornDownButton.className = "btn btn-danger";
      tornDownButton.onclick = () => handlers.onReportTornDown({ signId: sign.id });
      actionsSection.appendChild(tornDownButton);
    }

    if (capabilities.canRepair) {
      const repairButton = document.createElement("button");
      repairButton.textContent = "Opravit značku";
      repairButton.className = "btn btn-success";
      repairButton.onclick = () => handlers.onRepairSign({ signId: sign.id });
      actionsSection.appendChild(repairButton);
    }

   

    container.appendChild(actionsSection);
  }

  return container;
}