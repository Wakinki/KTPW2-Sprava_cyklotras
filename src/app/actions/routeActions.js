// src/app/actions/routeActions.js

// Navigační akce
export async function enterRouteList({ store }) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "ROUTE_LIST", selectedRouteId: null, selectedSignId: null },
  }));
}

export async function enterRouteDetail({ store, payload }) {
  const { routeId } = payload;
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "ROUTE_DETAIL", selectedRouteId: routeId, selectedSignId: null },
  }));
}

export async function enterRouteAdministration({ store, payload }) {
  const { routeId } = payload;
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "ROUTE_ADMINISTRATION", selectedRouteId: routeId, selectedSignId: null },
  }));
}

// CRUD akce
export async function createRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { name, description, } = payload;
  try {
    const { status, reason, route } = await api.routes.createRoute(
      { name, description, },
      token
    );

    store.setState((state) => {
      if (status === "SUCCESS") {
        return {
          ...state,
          routes: [...state.routes, route],
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla úspěšně vytvořena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Vytvoření se nezdařilo" },
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

export async function updateRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId, name, description} = payload;

  try {
    const { status, reason, route } = await api.routes.updateRoute(
      routeId,
      { name, description},
      token
    );

    store.setState((state) => {
      if (status === "SUCCESS") {
        const routes = state.routes.map((r) => (r.id === route.id ? route : r));
        return {
          ...state,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla úspěšně upravena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Úprava se nezdařila" },
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

export async function deleteRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId } = payload;

  try {
    const { status, reason } = await api.routes.deleteRoute(routeId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const routes = state.routes.filter((r) => r.id !== routeId);
        return {
          ...state,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla úspěšně smazána" },
            selectedRouteId: null,
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Smazání se nezdařilo" },
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

// Stavové přechody
export async function proposeRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId } = payload;

  try {
    const { status, reason, route } = await api.routes.proposeRoute(routeId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const routes = state.routes.map((r) => (r.id === route.id ? route : r));
        return {
          ...state,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla navržena k schválení" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Navržení se nezdařilo" },
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

export async function signRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId } = payload;

  try {
    const { status, reason, route } = await api.routes.signRoute(routeId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const routes = state.routes.map((r) => (r.id === route.id ? route : r));
        return {
          ...state,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla vyznačena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Vyznačení se nezdařilo" },
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

export async function implementRoute({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId } = payload;

  try {
    const { status, reason, route } = await api.routes.implementRoute(routeId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const routes = state.routes.map((r) => (r.id === route.id ? route : r));
        return {
          ...state,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Trasa byla oficiálně implementována" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Implementace se nezdařila" },
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