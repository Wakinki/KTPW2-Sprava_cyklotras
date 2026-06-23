// src/ui/views/RouteAdministrationView.js
export function RouteAdministrationView({ viewState, handlers }) {
  const { route, capabilities } = viewState;

  if (!route) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = "Trasa nebyla nalezena.";
    return error;
  }

  const container = document.createElement("div");
  container.className = "view-container route-admin-view";

  const header = document.createElement("div");
  header.className = "view-header";

  const title = document.createElement("h1");
  title.textContent = `Administrace trasy: ${route.name}`;
  header.appendChild(title);

  container.appendChild(header);

  // Formulář pro úpravu
  const form = document.createElement("form");
  form.className = "edit-form";

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Upravit trasu";
  form.appendChild(formTitle);

  const nameGroup = document.createElement("div");
  nameGroup.className = "form-group";
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Název:";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = route.name;
  nameInput.required = true;
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameInput);
  form.appendChild(nameGroup);

  const descGroup = document.createElement("div");
  descGroup.className = "form-group";
  const descLabel = document.createElement("label");
  descLabel.textContent = "Popis:";
  const descInput = document.createElement("textarea");
  descInput.value = route.description || "";
  descInput.rows = 3;
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);
  form.appendChild(descGroup);

  const lengthGroup = document.createElement("div");
  lengthGroup.className = "form-group";
  const lengthLabel = document.createElement("label");
  lengthLabel.textContent = "Délka (km):";
  const lengthInput = document.createElement("input");
  lengthInput.type = "number";
  lengthInput.step = "0.1";
  lengthInput.value = route.lengthKm;
  lengthInput.required = true;
  lengthGroup.appendChild(lengthLabel);
  lengthGroup.appendChild(lengthInput);
  form.appendChild(lengthGroup);

  const difficultyGroup = document.createElement("div");
  difficultyGroup.className = "form-group";
  const difficultyLabel = document.createElement("label");
  difficultyLabel.textContent = "Obtížnost:";
  const difficultySelect = document.createElement("select");
  ["EASY", "MEDIUM", "HARD"].forEach((d) => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    if (d === route.difficulty) option.selected = true;
    difficultySelect.appendChild(option);
  });
  difficultyGroup.appendChild(difficultyLabel);
  difficultyGroup.appendChild(difficultySelect);
  form.appendChild(difficultyGroup);

  if (capabilities?.canEdit) {
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Uložit změny";
    saveButton.className = "btn btn-primary";
    saveButton.onclick = () => {
      handlers.onUpdateRoute({
        routeId: route.id,
        name: nameInput.value,
        description: descInput.value,
        lengthKm: parseFloat(lengthInput.value),
        difficulty: difficultySelect.value,
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
      proposeButton.textContent = "Navrhnout k schválení (DRAFT → PROPOSED)";
      proposeButton.className = "btn btn-info";
      proposeButton.onclick = () => handlers.onProposeRoute({ routeId: route.id });
      stateButtons.appendChild(proposeButton);
    }

    if (capabilities.canSign) {
      const signButton = document.createElement("button");
      signButton.textContent = "Podepsat trasu (PROPOSED → SIGNED)";
      signButton.className = "btn btn-success";
      signButton.onclick = () => handlers.onSignRoute({ routeId: route.id });
      stateButtons.appendChild(signButton);
    }

    if (capabilities.canImplement) {
      const implementButton = document.createElement("button");
      implementButton.textContent = "Implementovat (SIGNED → OFFICIALLY_IMPLEMENTED)";
      implementButton.className = "btn btn-success";
      implementButton.onclick = () => handlers.onImplementRoute({ routeId: route.id });
      stateButtons.appendChild(implementButton);
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
    deleteButton.textContent = `Smazat trasu "${route.name}"`;
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = () => {
      if (confirm(`Opravdu chcete trvale smazat trasu "${route.name}"?`)) {
        handlers.onDeleteRoute({ routeId: route.id });
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