// src/ui/views/SignAdministrationView.js
export function SignAdministrationView({ viewState, handlers }) {
  const { sign, capabilities } = viewState;

  if (!sign) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = "Značka nebyla nalezena.";
    return error;
  }

  const container = document.createElement("div");
  container.className = "view-container sign-admin-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = `Administrace značky: ${sign.id}`;
  header.appendChild(title);

  container.appendChild(header);

  // Formulář pro úpravu
  const form = document.createElement("form");
  form.className = "edit-form";

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Upravit značku";
  form.appendChild(formTitle);

  const routeGroup = document.createElement("div");
  routeGroup.className = "form-group";
  const routeLabel = document.createElement("label");
  routeLabel.textContent = "Trasa:";
  const routeInput = document.createElement("input");
  routeInput.type = "text";
  routeInput.value = sign.routeId;
  routeInput.readOnly = true;
  routeGroup.appendChild(routeLabel);
  routeGroup.appendChild(routeInput);
  form.appendChild(routeGroup);

  const latGroup = document.createElement("div");
  latGroup.className = "form-group";
  const latLabel = document.createElement("label");
  latLabel.textContent = "Zeměpisná šířka (lat):";
  const latInput = document.createElement("input");
  latInput.type = "text";
  latInput.value = sign.location.lat;
  latGroup.appendChild(latLabel);
  latGroup.appendChild(latInput);
  form.appendChild(latGroup);

  const lngGroup = document.createElement("div");
  lngGroup.className = "form-group";
  const lngLabel = document.createElement("label");
  lngLabel.textContent = "Zeměpisná délka (lng):";
  const lngInput = document.createElement("input");
  lngInput.type = "text";
  lngInput.value = sign.location.lng;
  lngGroup.appendChild(lngLabel);
  lngGroup.appendChild(lngInput);
  form.appendChild(lngGroup);

  const directionGroup = document.createElement("div");
  directionGroup.className = "form-group";
  const directionLabel = document.createElement("label");
  directionLabel.textContent = "Směr:";
  const directionSelect = document.createElement("select");
  ["RIGHT", "LEFT", "FORWARD", "SPECIAL", "END"].forEach((d) => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    if (d === sign.direction) option.selected = true;
    directionSelect.appendChild(option);
  });
  directionGroup.appendChild(directionLabel);
  directionGroup.appendChild(directionSelect);
  form.appendChild(directionGroup);

  const typeGroup = document.createElement("div");
  typeGroup.className = "form-group";
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Typ:";
  const typeSelect = document.createElement("select");
  ["NORMAL", ""].forEach((t) => {
    const option = document.createElement("option");
    option.value = t;
    option.textContent = t || "Výchozí";
    if (t === sign.type) option.selected = true;
    typeSelect.appendChild(option);
  });
  typeGroup.appendChild(typeLabel);
  typeGroup.appendChild(typeSelect);
  form.appendChild(typeGroup);

  if (capabilities?.canEdit) {
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Uložit změny";
    saveButton.className = "btn btn-primary";
    saveButton.onclick = () => {
      handlers.onUpdateSign({
        signId: sign.id,
        location: { lat: latInput.value, lng: lngInput.value },
        direction: directionSelect.value,
        type: typeSelect.value,
      });
    };
    form.appendChild(saveButton);
  }

  container.appendChild(form);

  // Stavové akce
  if (capabilities) {
    const stateActions = document.createElement("div");
    stateActions.className = "state-actions";

    const stateTitle = document.createElement("h2");
    stateTitle.textContent = "Stavové akce";
    stateActions.appendChild(stateTitle);

    const stateButtons = document.createElement("div");
    stateButtons.className = "state-buttons";

    if (capabilities.canPropose) {
      const proposeButton = document.createElement("button");
      proposeButton.textContent = "Navrhnout (DRAFTED → PROPOSED)";
      proposeButton.className = "btn btn-info";
      proposeButton.onclick = () => handlers.onProposeSign({ signId: sign.id });
      stateButtons.appendChild(proposeButton);
    }

    if (capabilities.canConfirm) {
      const confirmButton = document.createElement("button");
      confirmButton.textContent = "Potvrdit (PROPOSED → OK)";
      confirmButton.className = "btn btn-success";
      confirmButton.onclick = () => handlers.onConfirmSign({ signId: sign.id });
      stateButtons.appendChild(confirmButton);
    }

    if (capabilities.canCancel) {
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Zrušit (DRAFTED/PROPOSED → CANCELED)";
      cancelButton.className = "btn btn-warning";
      cancelButton.onclick = () => handlers.onCancelSign({ signId: sign.id });
      stateButtons.appendChild(cancelButton);
    }

    if (capabilities.canReportTornDown) {
      const tornDownButton = document.createElement("button");
      tornDownButton.textContent = "Nahlásit stržení (OK → TORN_DOWN)";
      tornDownButton.className = "btn btn-danger";
      tornDownButton.onclick = () => handlers.onReportTornDown({ signId: sign.id });
      stateButtons.appendChild(tornDownButton);
    }

    if (capabilities.canRepair) {
      const repairButton = document.createElement("button");
      repairButton.textContent = "Opravit (TORN_DOWN → OK)";
      repairButton.className = "btn btn-success";
      repairButton.onclick = () => handlers.onRepairSign({ signId: sign.id });
      stateButtons.appendChild(repairButton);
    }

    stateActions.appendChild(stateButtons);
    container.appendChild(stateActions);
  }

  // Nebezpečné akce
  if (capabilities?.canDelete) {
    const dangerSection = document.createElement("div");
    dangerSection.className = "danger-zone";

    const dangerTitle = document.createElement("h2");
    dangerTitle.textContent = "Nebezpečná zóna";
    dangerSection.appendChild(dangerTitle);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = `Smazat značku "${sign.id}"`;
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = () => {
      if (confirm(`Opravdu chcete trvale smazat značku "${sign.id}"?`)) {
        handlers.onDeleteSign({ signId: sign.id });
      }
    };
    dangerSection.appendChild(deleteButton);
    container.appendChild(dangerSection);
  }

  // Navigace
  const navSection = document.createElement("div");
  navSection.className = "navigation-section";

  const backToDetail = document.createElement("button");
  backToDetail.textContent = "Zpět na detail";
  backToDetail.className = "btn btn-secondary";
  backToDetail.onclick = handlers.onBackToDetail;
  navSection.appendChild(backToDetail);

  const backToList = document.createElement("button");
  backToList.textContent = "Zpět na seznam";
  backToList.className = "btn btn-secondary";
  backToList.onclick = handlers.onBackToList;
  navSection.appendChild(backToList);

  container.appendChild(navSection);

  return container;
}