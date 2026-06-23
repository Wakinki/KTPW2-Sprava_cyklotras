// src/app/actionHandlers/dashboardHandlers.js
export function dashboardHandlers(dispatch, viewState) {
  return {
    onEnterRouteList: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" });
      window.history.pushState({}, "", "#/routes");
    },
    onEnterSignList: () => {
      dispatch({ type: "ENTER_SIGN_LIST" });
      window.history.pushState({}, "", "#/signs");
    },
  };
}