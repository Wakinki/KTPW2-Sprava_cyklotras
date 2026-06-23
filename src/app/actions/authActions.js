// src/app/actions/authActions.js
import { loadInitialData } from "./loadInitialData.js";

// Navigační akce
export async function enterAuthentication({ store }) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "AUTHENTICATION", selectedRouteId: null, selectedSignId: null },
  }));
}

export async function enterDashboard({ store }) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "DASHBOARD", selectedRouteId: null, selectedSignId: null },
  }));
}

// Autentizační akce
export async function registerUser({ store, api, payload }) {
  const { username, password } = payload;

  try {
    const { status, reason, userId } = await api.auth.register({ username, password });

    store.setState((state) => {
      if (status === "SUCCESS") {
        return {
          ...state,
          ui: {
            ...state.ui,
            notification: {
              type: "SUCCESS",
              message: "Registrace proběhla úspěšně. Nyní se můžete přihlásit.",
            },
            mode: "AUTHENTICATION",
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Registrace se nezdařila" },
        },
      };
    });
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, notification: { type: "ERROR", message: error.message } },
    }));
  }
}

export async function loginUser({ store, api, payload }) {
  const { username, password } = payload;

  try {
   
    const { status, reason, role, userId, token } = await api.auth.login({ username, password });

    if (status === "SUCCESS") {
     
      const [routesResult, signsResult] = await Promise.all([
        api.routes.getRoutes(token),   
        api.signs.getSigns(token),      
      ]);

    
      store.setState((state) => ({
        ...state,
        auth: {
          role,
          userId,
          token,
          username,  
          name: username 
        },
        routes: routesResult.status === "SUCCESS" ? routesResult.routes : [],
        signs: signsResult.status === "SUCCESS" ? signsResult.signs : [],
        ui: {
          ...state.ui,
          notification: {
            type: "SUCCESS",
            message: `Přihlášení úspěšné. Vítejte, ${username}!`,
          },
          mode: "DASHBOARD",
        },
      }));

      return; 
    }

   
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        notification: { type: "ERROR", message: reason || "Přihlášení se nezdařilo" },
      },
    }));

  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, notification: { type: "ERROR", message: error.message } },
    }));
  }
}

export async function logoutUser({ store, api }) {
  const { token } = store.getState().auth;

  try {
    const { status, reason } = await api.auth.logout(token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        return {
          ...state,
          auth: { role: "ANONYMOUS", userId: null, token: null },
          routes: [],
          signs: [],
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Odhlášení proběhlo úspěšně" },
            mode: "AUTHENTICATION",
            selectedRouteId: null,
            selectedSignId: null,
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Odhlášení se nezdařilo" },
        },
      };
    });
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, notification: { type: "ERROR", message: error.message } },
    }));
  }
}