// src/app/actionHandlers/navigationPanelHandlers.js
export function createNavigationPanelHandlers(dispatch) {
  return {
    onNavigateToDashboard: () => {
      dispatch({ type: "ENTER_DASHBOARD" });
      window.history.pushState({}, "", "#/");
    },
    onNavigateToRoutes: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" });
      window.history.pushState({}, "", "#/routes");
    },
    onNavigateToSigns: () => {
      dispatch({ type: "ENTER_SIGN_LIST" });
      window.history.pushState({}, "", "#/signs");
    },
    onNavigateToAuth: () => {
      dispatch({ type: "ENTER_AUTHENTICATION" });
      window.history.pushState({}, "", "#/auth");
    },
  };
}