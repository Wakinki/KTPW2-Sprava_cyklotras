// src/app/actionHandlers/authenticationHandlers.js
export function authenticationHandlers(dispatch, viewState) {
  return {
    onRegister: (payload) => {
      dispatch({ type: "REGISTER", payload });
    },
    onLogin: (payload) => {
      dispatch({ type: "LOGIN", payload });
    },
    onLogout: () => {
      dispatch({ type: "LOGOUT" });
    },
    onEnterDashboard: () => {
      dispatch({ type: "ENTER_DASHBOARD" });
      window.history.pushState({}, "", "#/");
    },
  };
}