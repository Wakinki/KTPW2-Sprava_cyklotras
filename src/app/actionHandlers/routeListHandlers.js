// src/app/actionHandlers/routeListHandlers.js
export function routeListHandlers(dispatch, viewState) {
  return {
    onEnterRouteDetail: (payload) => {
      dispatch({ type: "ENTER_ROUTE_DETAIL", payload });
      window.history.pushState({}, "", `#/routes/${payload.routeId}`);
    },
    onEnterRouteAdministration: (payload) => {
      dispatch({ type: "ENTER_ROUTE_ADMINISTRATION", payload });
      window.history.pushState({}, "", `#/routes/${payload.routeId}/edit`);
    },
    onEnterSignList: () => {
      dispatch({ type: "ENTER_SIGN_LIST" });
      window.history.pushState({}, "", "#/signs");
    },
    onCreateRoute: () => {
      const name = prompt("Zadejte název trasy:");
      if (!name) return;

      const description = prompt("Zadejte popis trasy:");
      

      if (name ) {
        
        dispatch({
          type: "CREATE_ROUTE",
          payload: { name, description},
        });
      } else {
        alert("Neplatné údaje!");
      }
    },
  };
}