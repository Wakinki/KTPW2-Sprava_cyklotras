// src/app/state.js
export function createInitialState() {
  return {
    // Domain data
    users: [],
    routes: [],
    signs: [],

    // Identity
    auth: { role: "ANONYMOUS", userId: null, token: null },

    // UI state
    ui: {
      mode: "AUTHENTICATION",
      selectedRouteId: null,
      selectedSignId: null,
      status: "LOADING",
      message: null,
      notification: null,
    },
  };
}