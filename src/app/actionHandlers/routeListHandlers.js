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
      const lengthKm = parseFloat(prompt("Zadejte délku v km:", "25.5"));
      const difficulty = prompt("Zadejte obtížnost (EASY/MEDIUM/HARD):", "EASY");

      if (name && !isNaN(lengthKm) && difficulty) {
        console.log( { name, description, lengthKm, difficulty })
        console.log(dispatch)
        dispatch({
          type: "CREATE_ROUTE",
          payload: { name, description, lengthKm, difficulty },
        });
      } else {
        alert("Neplatné údaje!");
      }
    },
  };
}