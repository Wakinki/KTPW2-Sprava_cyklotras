// src/app/actionHandlers/signListHandlers.js
export function signListHandlers(dispatch, viewState) {
  return {
    onEnterSignDetail: (payload) => {
      dispatch({ type: "ENTER_SIGN_DETAIL", payload });
      window.history.pushState({}, "", `#/signs/${payload.signId}`);
    },
    onEnterSignAdministration: (payload) => {
      dispatch({ type: "ENTER_SIGN_ADMINISTRATION", payload });
      window.history.pushState({}, "", `#/signs/${payload.signId}/edit`);
    },
    onEnterRouteList: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" });
      window.history.pushState({}, "", "#/routes");
    },
    onCreateSign: () => {
      const routeId = prompt("Zadejte ID trasy, ke které značka patří:");
      if (!routeId) return;

      const lat = prompt("Zadejte zeměpisnou šířku (lat):", "50.0755");
      const lng = prompt("Zadejte zeměpisnou délku (lng):", "14.4065");
      const direction = prompt("Zadejte směr (RIGHT/LEFT/FORWARD/SPECIAL/END):", "FORWARD");
      const type = prompt("Zadejte typ (NORMAL/prázdno):", "NORMAL");

      if (routeId && lat && lng && direction) {

       dispatch({
          type: "CREATE_SIGN",
          payload: {
            routeId,
            location: { lat, lng },
            direction,
            type: type || "NORMAL",
          },
        });

      } else {
        alert("Neplatné údaje!");
      }
    },
  };
}