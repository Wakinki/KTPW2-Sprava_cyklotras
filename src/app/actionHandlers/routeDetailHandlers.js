// src/app/actionHandlers/routeDetailHandlers.js
export function routeDetailHandlers(dispatch, viewState) {
  return {
    onBackToList: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" });
      window.history.pushState({}, "", "#/routes");
    },
    onEnterRouteAdministration: (payload) => {
      dispatch({ type: "ENTER_ROUTE_ADMINISTRATION", payload });
      window.history.pushState({}, "", `#/routes/${payload.routeId}/edit`);
    },

    onEnterSignDetail: (payload) => {
      dispatch({ type: "ENTER_SIGN_DETAIL", payload });
      window.history.pushState({}, "", `#/signs/${payload.signId}`);
    },
    onCreateSign: (routeId) => {
      const lat = prompt("Zeměpisná šířka (lat):", "50.0755");
      const lng = prompt("Zeměpisná délka (lng):", "14.4065");
      const direction = prompt("Směr (RIGHT/LEFT/FORWARD/SPECIAL/END):", "FORWARD");
      const type = prompt("Typ (NORMAL/prázdno):", "NORMAL");

      if (lat && lng && direction) {
        dispatch({
          type: "CREATE_SIGN",
          payload: {
            routeId,
            location: { lat, lng },
            direction,
            type: type || "NORMAL"
          }
        });
      }
    },
    onProposeRoute: (payload) => {
      if (confirm("Opravdu chcete navrhnout tuto trasu k schválení?")) {
        dispatch({ type: "PROPOSE_ROUTE", payload });
      }
    },
    onSignRoute: (payload) => {
      if (confirm("Opravdu chcete vyznačkovat tuto trasu?")) {
        dispatch({ type: "SIGN_ROUTE", payload });
      }
    },
    onImplementRoute: (payload) => {
      if (confirm("Opravdu chcete oficiálně implementovat tuto trasu?")) {
        dispatch({ type: "IMPLEMENT_ROUTE", payload });
      }
    },
  };
}