// src/ui/views/AuthenticationView.js
export function AuthenticationView({ viewState, handlers }) {
  const { isLoggedIn, role, capabilities } = viewState;

  const container = document.createElement("div");
  container.className = "view-container auth-view";

  if (isLoggedIn) {
    // Přihlášený uživatel
    const loggedInSection = document.createElement("div");
    loggedInSection.className = "logged-in-section";

    const title = document.createElement("h1");
    title.textContent = "Přihlášení";
    loggedInSection.appendChild(title);

    const info = document.createElement("p");
    info.textContent = `Jste přihlášen jako: ${role}`;
    loggedInSection.appendChild(info);

    if (capabilities?.canLogout) {
      const logoutButton = document.createElement("button");
      logoutButton.textContent = "Odhlásit se";
      logoutButton.className = "btn btn-danger";
      logoutButton.onclick = handlers.onLogout;
      loggedInSection.appendChild(logoutButton);
    }

    if (capabilities?.canEnterDashboard) {
      const dashboardButton = document.createElement("button");
      dashboardButton.textContent = "Přejít na nástěnku";
      dashboardButton.className = "btn btn-primary";
      dashboardButton.onclick = handlers.onEnterDashboard;
      loggedInSection.appendChild(dashboardButton);
    }

    container.appendChild(loggedInSection);
  } else {
    // Přihlašovací formulář
    const loginSection = document.createElement("div");
    loginSection.className = "auth-section";

    const loginTitle = document.createElement("h1");
    loginTitle.textContent = "Přihlášení";
    loginSection.appendChild(loginTitle);

    const loginForm = document.createElement("form");
    loginForm.className = "auth-form";

    const usernameGroup = document.createElement("div");
    usernameGroup.className = "form-group";
    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Uživatelské jméno:";
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.required = true;
    usernameInput.placeholder = "Zadejte uživatelské jméno";
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    loginForm.appendChild(usernameGroup);

    const passwordGroup = document.createElement("div");
    passwordGroup.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Heslo:";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.required = true;
    passwordInput.placeholder = "Zadejte heslo";
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    loginForm.appendChild(passwordGroup);

    if (capabilities?.canLogin) {
      const loginButton = document.createElement("button");
      loginButton.type = "button";
      loginButton.textContent = "Přihlásit se";
      loginButton.className = "btn btn-primary";
      loginButton.onclick = () => {
        handlers.onLogin({
          username: usernameInput.value,
          password: passwordInput.value,
        });
      };
      loginForm.appendChild(loginButton);
    }

    loginSection.appendChild(loginForm);
    container.appendChild(loginSection);

    // Registrační formulář
    if (capabilities?.canRegister) {
      const registerSection = document.createElement("div");
      registerSection.className = "auth-section";

      const registerTitle = document.createElement("h2");
      registerTitle.textContent = "Registrace nového uživatele";
      registerSection.appendChild(registerTitle);

      const registerForm = document.createElement("form");
      registerForm.className = "auth-form";

      const regUsernameGroup = document.createElement("div");
      regUsernameGroup.className = "form-group";
      const regUsernameLabel = document.createElement("label");
      regUsernameLabel.textContent = "Uživatelské jméno:";
      const regUsernameInput = document.createElement("input");
      regUsernameInput.type = "text";
      regUsernameInput.name = "reg-username";
      regUsernameInput.required = true;
      regUsernameInput.placeholder = "Zadejte uživatelské jméno";
      regUsernameGroup.appendChild(regUsernameLabel);
      regUsernameGroup.appendChild(regUsernameInput);
      registerForm.appendChild(regUsernameGroup);

      const regPasswordGroup = document.createElement("div");
      regPasswordGroup.className = "form-group";
      const regPasswordLabel = document.createElement("label");
      regPasswordLabel.textContent = "Heslo:";
      const regPasswordInput = document.createElement("input");
      regPasswordInput.type = "password";
      regPasswordInput.name = "reg-password";
      regPasswordInput.required = true;
      regPasswordInput.placeholder = "Zadejte heslo";
      regPasswordGroup.appendChild(regPasswordLabel);
      regPasswordGroup.appendChild(regPasswordInput);
      registerForm.appendChild(regPasswordGroup);

      const roleGroup = document.createElement("div");
      roleGroup.className = "form-group";
     
      registerForm.appendChild(roleGroup);

      const registerButton = document.createElement("button");
      registerButton.type = "button";
      registerButton.textContent = "Zaregistrovat se";
      registerButton.className = "btn btn-secondary";
      registerButton.onclick = () => {
        handlers.onRegister({
          username: regUsernameInput.value,
          password: regPasswordInput.value,
        });
      };
      registerForm.appendChild(registerButton);

      registerSection.appendChild(registerForm);
      container.appendChild(registerSection);
    }
  }

  return container;
}