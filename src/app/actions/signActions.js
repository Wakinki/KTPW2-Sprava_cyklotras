// src/app/actions/signActions.js

// Navigační akce
export async function enterSignList({ store }) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "SIGN_LIST", selectedRouteId: null, selectedSignId: null },
  }));
}

export async function enterSignDetail({ store, payload }) {
  const { signId } = payload;
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "SIGN_DETAIL", selectedSignId: signId, selectedRouteId: null },
  }));
}

export async function enterSignAdministration({ store, payload }) {
  const { signId } = payload;
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, mode: "SIGN_ADMINISTRATION", selectedSignId: signId, selectedRouteId: null },
  }));
}

// CRUD akce
export async function createSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { routeId, location, direction, type } = payload;

  try {
    const { status, reason, sign } = await api.signs.createSign(
      { routeId, location, direction, type },
      token
    );

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = [...state.signs, sign];
        const routes = state.routes.map((r) => {
          if (r.id === routeId) {
            return { ...r, signIds: [...r.signIds, sign.id] };
          }
          return r;
        });
        return {
          ...state,
          signs,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla úspěšně vytvořena" },
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

export async function updateSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId, location, direction, type } = payload;

  try {
    const { status, reason, sign } = await api.signs.updateSign(
      signId,
      { location, direction, type },
      token
    );

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla úspěšně upravena" },
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

export async function deleteSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason } = await api.signs.deleteSign(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.filter((s) => s.id !== signId);
        // Odstraň signId z příslušné trasy
        const routes = state.routes.map((r) => ({
          ...r,
          signIds: r.signIds.filter((id) => id !== signId),
        }));
        return {
          ...state,
          signs,
          routes,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla úspěšně smazána" },
            selectedSignId: null,
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
export async function proposeSign({ store, api, payload }) {
  
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason, sign } = await api.signs.proposeSign(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla navržena k schválení" },
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

export async function confirmSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason, sign } = await api.signs.confirmSign(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla potvrzena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Potvrzení se nezdařilo" },
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

export async function cancelSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason, sign } = await api.signs.cancelSign(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla zrušena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Zrušení se nezdařilo" },
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

export async function reportTornDown({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason, sign } = await api.signs.reportTornDown(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla nahlášena jako stržená" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Nahlášení se nezdařilo" },
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

export async function repairSign({ store, api, payload }) {
  const { token } = store.getState().auth;
  const { signId } = payload;

  try {
    const { status, reason, sign } = await api.signs.repairSign(signId, token);

    store.setState((state) => {
      if (status === "SUCCESS") {
        const signs = state.signs.map((s) => (s.id === sign.id ? sign : s));
        return {
          ...state,
          signs,
          ui: {
            ...state.ui,
            notification: { type: "SUCCESS", message: "Značka byla opravena" },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { type: "ERROR", message: reason || "Oprava se nezdařila" },
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