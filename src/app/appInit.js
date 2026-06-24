// src/app/appInit.js
import { urlToAction } from "../infra/router/router.js";

export async function appInit({ store, api, dispatch }) {
  // Testovací token - v reálné aplikaci by se bral z localStorage
  // Pro testování můžete odkomentovat některý z tokenů:
  // const token = "maintainer-1_12345678";  // MAINTAINER
  // const token = "admin-1_87654321";      // ADMINISTRATOR
  const token = null;

  // Nastavení stavu načítání
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, status: "LOADING", message: null },
  }));

  // Kontrola přihlášení
  let auth = {
    role: "ANONYMOUS",
    userId: null,
    token: null,
  };

  if (token) {
    const whoResult = await api.auth.whoAmI(token);
    if (whoResult.status === "SUCCESS") {
      auth = {
        role: whoResult.role,
        userId: whoResult.userId,
        token,
      };
    }
  }

  // Načtení doménových dat (pouze pokud je uživatel přihlášen)
  let routes = [];
  let signs = [];
  
  if (auth.token) {
    try {
      const [routesResult, signsResult] = await Promise.all([
        api.routes.getRoutes(auth.token),
        api.signs.getSigns(auth.token),
      ]);

      if (routesResult.status === "SUCCESS") {
        routes = routesResult.routes;
      }
      if (signsResult.status === "SUCCESS") {
        signs = signsResult.signs;
      }
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
    }
  }

  // Přepnutí do READY stavu
  store.setState((state) => ({
    ...state,
    auth,
    routes,
    signs,
    ui: { ...state.ui, status: "READY", message: null },
  }));

  // První navigace podle URL
   if (auth.role === "ANONYMOUS") {
    // Není přihlášen -> zůstaň na přihlášení
    dispatch({ type: "ENTER_AUTHENTICATION" });
    window.history.replaceState({}, "", "#/auth");
  } else {
    // Je přihlášen -> použij URL z adresního řádku
    const initialAction = urlToAction(window.location.href);
    dispatch(initialAction);
  }
}