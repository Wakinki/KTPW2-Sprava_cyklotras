// src/ui/components/NavigationPanelComponent.js
export function NavigationPanelComponent({ handlers, auth }) {
  const { role } = auth;
  const isLoggedIn = role !== "ANONYMOUS" && auth.token !== null;

  const nav = document.createElement("nav");
  nav.className = "navigation-panel";

  if (isLoggedIn) {
    const dashboardLink = document.createElement("a");
    dashboardLink.href = "#/";
    dashboardLink.textContent = "Nástěnka";
    dashboardLink.onclick = (e) => {
      e.preventDefault();
      handlers.onNavigateToDashboard();
    };
    nav.appendChild(dashboardLink);

    const routesLink = document.createElement("a");
    routesLink.href = "#/routes";
    routesLink.textContent = "Trasy";
    routesLink.onclick = (e) => {
      e.preventDefault();
      handlers.onNavigateToRoutes();
    };
    nav.appendChild(routesLink);

    /* const signsLink = document.createElement("a");
    signsLink.href = "#/signs";
    signsLink.textContent = "Značky";
    signsLink.onclick = (e) => {
      e.preventDefault();
      handlers.onNavigateToSigns();
    };
    nav.appendChild(signsLink); */

    const logoutLink = document.createElement("a");
    logoutLink.href = "#/auth";
    logoutLink.textContent = `Odhlásit (${role})`;
    logoutLink.onclick = (e) => {
      e.preventDefault();
      handlers.onNavigateToAuth();
    };
    nav.appendChild(logoutLink);
  } else {
    const loginLink = document.createElement("a");
    loginLink.href = "#/auth";
    loginLink.textContent = "Přihlášení";
    loginLink.onclick = (e) => {
      e.preventDefault();
      handlers.onNavigateToAuth();
    };
    nav.appendChild(loginLink);
  }

  return nav;
}