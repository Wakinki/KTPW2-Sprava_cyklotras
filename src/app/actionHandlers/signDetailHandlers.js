// src/app/actionHandlers/signDetailHandlers.js
export function signDetailHandlers(dispatch, viewState) {
  const { sign, route } = viewState;

  return {
    onBackToList: () => {
      dispatch({ type: "ENTER_ROUTE_LIST" }); 
      window.history.pushState({}, "", "#/routes");
    },
    onEnterSignAdministration: () => {
      dispatch({ type: "ENTER_SIGN_ADMINISTRATION", payload: { signId: sign.id } });
      window.history.pushState({}, "", `#/signs/${sign.id}/edit`);
    },
    onProposeSign: () => {
      if (confirm("Opravdu chcete navrhnout tuto značku k schválení?")) {
        dispatch({ type: "PROPOSE_SIGN", payload: { signId: sign.id } });
      }
    },
    onConfirmSign: () => {
      if (confirm("Opravdu chcete potvrdit tuto značku?")) {
        dispatch({ type: "CONFIRM_SIGN", payload: { signId: sign.id } });
      }
    },
    onCancelSign: () => {
      if (confirm("Opravdu chcete zrušit tuto značku?")) {
        dispatch({ type: "CANCEL_SIGN", payload: { signId: sign.id } });
      }
    },
    onReportTornDown: () => {
      if (confirm("Opravdu chcete nahlásit tuto značku jako strženou?")) {
        dispatch({ type: "REPORT_TORN_DOWN", payload: { signId: sign.id } });
      }
    },
    onRepairSign: () => {
      if (confirm("Opravdu chcete opravit tuto značku?")) {
        dispatch({ type: "REPAIR_SIGN", payload: { signId: sign.id } });
      }
    },
    onBackToRouteDetail: () => {
      if (route) {
        dispatch({ type: "ENTER_ROUTE_DETAIL", payload: { routeId: route.id } });
        window.history.pushState({}, "", `#/routes/${route.id}`);
      } else {
        dispatch({ type: "ENTER_ROUTE_LIST" });
        window.history.pushState({}, "", "#/routes");
      }
    },
  };
}