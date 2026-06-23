// src/app/actionHandlers/createHandlers.js
import { dashboardHandlers } from "./dashboardHandlers.js";
import { authenticationHandlers } from "./authenticationHandlers.js";
import { routeListHandlers } from "./routeListHandlers.js";
import { routeDetailHandlers } from "./routeDetailHandlers.js";
import { routeAdministrationHandlers } from "./routeAdministrationHandlers.js";
import { signListHandlers } from "./signListHandlers.js";
import { signDetailHandlers } from "./signDetailHandlers.js";
import { signAdministrationHandlers } from "./signAdministrationHandlers.js";
import { errorHandlers } from "./errorHandlers.js";

export function createHandlers(dispatch, viewState) {
  switch (viewState.type) {
    case "DASHBOARD":
      return dashboardHandlers(dispatch, viewState);
    case "AUTHENTICATION":
      return authenticationHandlers(dispatch, viewState);
    case "ROUTE_LIST":
      return routeListHandlers(dispatch, viewState);
    case "ROUTE_DETAIL":
      return routeDetailHandlers(dispatch, viewState);
    case "ROUTE_ADMINISTRATION":
      return routeAdministrationHandlers(dispatch, viewState);
    case "SIGN_LIST":
      return signListHandlers(dispatch, viewState);
    case "SIGN_DETAIL":
      return signDetailHandlers(dispatch, viewState);
    case "SIGN_ADMINISTRATION":
      return signAdministrationHandlers(dispatch, viewState);
    case "ERROR":
      return errorHandlers(dispatch);
    case "LOADING":
    default:
      return {};
  }
}