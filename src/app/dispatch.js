// src/app/dispatch.js
import { appInit } from "./appInit.js";

// Auth actions
import {
  enterAuthentication,
  enterDashboard,
  registerUser,
  loginUser,
  logoutUser,
} from "./actions/authActions.js";

// Route actions
import {
  enterRouteList,
  enterRouteDetail,
  enterRouteAdministration,
  createRoute,
  updateRoute,
  deleteRoute,
  proposeRoute,
  signRoute,
  implementRoute,
} from "./actions/routeActions.js";

// Sign actions
import {
  enterSignList,
  enterSignDetail,
  enterSignAdministration,
  createSign,
  updateSign,
  deleteSign,
  proposeSign,
  confirmSign,
  cancelSign,
  reportTornDown,
  repairSign,
} from "./actions/signActions.js";

import { loadInitialData } from "./actions/loadInitialData.js"; 

/**
 * Vytvoří funkci dispatch, která podle typu akce volá příslušnou akci.
 */
export function createDispatcher(store, api) {
  return async function dispatch(action) {
    const { type, payload = {} } = action ?? {};

    switch (type) {
      // ========== INICIALIZACE ==========
      case "APP_INIT":
        return appInit({ store, api, dispatch });
       case "LOAD_INITIAL_DATA":
        return loadInitialData({ store, api, payload });

      // ========== AUTHENTIKACE ==========
      case "ENTER_AUTHENTICATION":
        return enterAuthentication({ store });
      case "ENTER_DASHBOARD":
        return enterDashboard({ store });
      case "REGISTER":
        return registerUser({ store, api, payload });
      case "LOGIN":
        return loginUser({ store, api, payload });
      case "LOGOUT":
        return logoutUser({ store, api });

      // ========== ROUTES - NAVIGACE ==========
      case "ENTER_ROUTE_LIST":
        return enterRouteList({ store });
      case "ENTER_ROUTE_DETAIL":
        return enterRouteDetail({ store, payload });
      case "ENTER_ROUTE_ADMINISTRATION":
        return enterRouteAdministration({ store, payload });

      // ========== ROUTES - CRUD ==========
      case "CREATE_ROUTE":
        return createRoute({ store, api, payload });
      case "UPDATE_ROUTE":
        return updateRoute({ store, api, payload });
      case "DELETE_ROUTE":
        return deleteRoute({ store, api, payload });

      // ========== ROUTES - STAVOVÉ PŘECHODY ==========
      case "PROPOSE_ROUTE":
        return proposeRoute({ store, api, payload });
      case "SIGN_ROUTE":
        return signRoute({ store, api, payload });
      case "IMPLEMENT_ROUTE":
        return implementRoute({ store, api, payload });

      // ========== SIGNS - NAVIGACE ==========
      case "ENTER_SIGN_LIST":
        return enterSignList({ store });
      case "ENTER_SIGN_DETAIL":
        return enterSignDetail({ store, payload });
      case "ENTER_SIGN_ADMINISTRATION":
        return enterSignAdministration({ store, payload })

      // ========== SIGNS - CRUD ==========
      case "CREATE_SIGN":
        return createSign({ store, api, payload });
      case "UPDATE_SIGN":
        return updateSign({ store, api, payload });
      case "DELETE_SIGN":
        return deleteSign({ store, api, payload });

      // ========== SIGNS - STAVOVÉ PŘECHODY ==========
      case "PROPOSE_SIGN":
        return proposeSign({ store, api, payload });
      case "CONFIRM_SIGN":
        return confirmSign({ store, api, payload });
      case "CANCEL_SIGN":
        return cancelSign({ store, api, payload });
      case "REPORT_TORN_DOWN":
        return reportTornDown({ store, api, payload });
      case "REPAIR_SIGN":
        return repairSign({ store, api, payload });

      // ========== DEFAULT ==========
      default:
        console.warn(`Unknown action type: ${type}`);
    }
  };
}