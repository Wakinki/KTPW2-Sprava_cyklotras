// src/app/actionHandlers/routeAdministrationHandlers.js
export function routeAdministrationHandlers(dispatch, viewState) {
  const { route } = viewState;

  return {
    onBackToList: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" });
      window.history.pushState({}, "", "#/routes");
    },
    onBackToDetail: () => {
      dispatch({ type: "ENTER_ROUTE_DETAIL", payload: { routeId: route.id } });
      window.history.pushState({}, "", `#/routes/${route.id}`);
    },
    onUpdateRoute: (payload) => {
      dispatch({ type: "UPDATE_ROUTE", payload });
    },
    onDeleteRoute: () => {
      if (confirm(`Opravdu chcete smazat trasu "${route.name}"?`)) {
        dispatch({ type: "DELETE_ROUTE", payload: { routeId: route.id } });
      }
    },
    onProposeRoute: () => {
      if (confirm("Opravdu chcete navrhnout tuto trasu k schválení?")) {
        dispatch({ type: "PROPOSE_ROUTE", payload: { routeId: route.id } });
      }
    },
    onSignRoute: () => {
      if (confirm("Opravdu chcete vyznačkovat tuto trasu?")) {
        dispatch({ type: "SIGN_ROUTE", payload: { routeId: route.id } });
      }
    },
    onImplementRoute: () => {
      if (confirm("Opravdu chcete oficiálně implementovat tuto trasu?")) {
        dispatch({ type: "IMPLEMENT_ROUTE", payload: { routeId: route.id } });
      }
    },
  };
}