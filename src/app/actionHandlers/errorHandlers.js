// src/app/actionHandlers/errorHandlers.js
export function errorHandlers(dispatch) {
  return {
    onBackToDashboard: () => {
      dispatch({ type: "ENTER_DASHBOARD" });
      window.history.pushState({}, "", "#/");
    },
  };
}