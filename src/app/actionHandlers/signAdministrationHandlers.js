// src/app/actionHandlers/signAdministrationHandlers.js
export function signAdministrationHandlers(dispatch, viewState) {
  const { sign } = viewState;

  return {
    onBackToList: () => {
      dispatch({ type: "ENTER_SIGN_LIST" });
      window.history.pushState({}, "", "#/signs");
    },
    onBackToDetail: () => {
      dispatch({ type: "ENTER_SIGN_DETAIL", payload: { signId: sign.id } });
      window.history.pushState({}, "", `#/signs/${sign.id}`);
    },
    onUpdateSign: (payload) => {
      dispatch({ type: "UPDATE_SIGN", payload });
    },
    onDeleteSign: () => {
      if (confirm(`Opravdu chcete smazat značku "${sign.id}"?`)) {
        dispatch({ type: "DELETE_SIGN", payload: { signId: sign.id } });
      }
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
  };
}