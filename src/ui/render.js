// src/ui/render.js
import { selectViewState } from "../infra/store/selectors.js";
import { createHandlers } from "../app/actionHandlers/createHandlers.js";
import { createNavigationPanelHandlers } from "../app/actionHandlers/navigationPanelHandlers.js";

// Import všech view komponent
import { LoadingView } from "./views/LoadingView.js";
import { ErrorView } from "./views/ErrorView.js";
import { DashboardView } from "./views/DashboardView.js";
import { AuthenticationView } from "./views/AuthenticationView.js";
import { RouteListView } from "./views/RouteListView.js";
import { RouteDetailView } from "./views/RouteDetailView.js";
import { RouteAdministrationView } from "./views/RouteAdministrationView.js";
import { SignListView } from "./views/SignListView.js";
import { SignDetailView } from "./views/SignDetailView.js";
import { SignAdministrationView } from "./views/SignAdministrationView.js";
import { NavigationPanelComponent } from "./components/NavigationPanelComponent.js";


/**
 * Hlavní renderovací funkce aplikace
 * @param {HTMLElement} root - Kořenový DOM element (#app)
 * @param {Object} state - Aktuální stav aplikace
 * @param {Function} dispatch - Funkce pro odesílání akcí
 */
export function render(root, state, dispatch) {
 
  root.replaceChildren();

  const viewState = selectViewState(state);

  const handlers = createHandlers(dispatch, viewState);

  const navigationPanelHandlers = createNavigationPanelHandlers(dispatch);
  const navigationPanel = NavigationPanelComponent({
    handlers: navigationPanelHandlers,
    auth: state.auth,
  });
  root.appendChild(navigationPanel);

  let mainView;

  switch (viewState.type) {
    case "LOADING":
      mainView = LoadingView();
      break;

    case "ERROR":
      mainView = ErrorView({
        message: viewState.message || "Došlo k neočekávané chybě",
        handlers: handlers,
      });
      break;

    case "DASHBOARD":
      mainView = DashboardView({
        viewState: viewState,
        handlers: handlers,
      });
      break;

    case "AUTHENTICATION":
      mainView = AuthenticationView({
        viewState: viewState,
        handlers: handlers,
      });
      break;

    case "ROUTE_LIST":
      mainView = RouteListView({
        viewState: viewState,
        handlers: handlers,
      });
      break;

    case "ROUTE_DETAIL":
      if (!viewState.route) {
        mainView = ErrorView({
          message: "Trasa nebyla nalezena",
          handlers: { onBackToList: handlers.onBackToList },
        });
      } else {
        mainView = RouteDetailView({
          viewState: viewState,
          handlers: handlers,
        });
      }
      break;

    case "ROUTE_ADMINISTRATION":
      if (!viewState.route) {
        mainView = ErrorView({
          message: "Trasa nebyla nalezena",
          handlers: { onBackToList: handlers.onBackToList },
        });
      } else {
        mainView = RouteAdministrationView({
          viewState: viewState,
          handlers: handlers,
        });
      }
      break;

    case "SIGN_LIST":
      mainView = SignListView({
        viewState: viewState,
        handlers: handlers,
      });
      break;

    case "SIGN_DETAIL":
      if (!viewState.sign) {
        mainView = ErrorView({
          message: "Značka nebyla nalezena",
          handlers: { onBackToList: handlers.onBackToList },
        });
      } else {
        mainView = SignDetailView({
          viewState: viewState,
          handlers: handlers,
        });
      }
      break;

    case "SIGN_ADMINISTRATION":
      if (!viewState.sign) {
        mainView = ErrorView({
          message: "Značka nebyla nalezena",
          handlers: { onBackToList: handlers.onBackToList },
        });
      } else {
        mainView = SignAdministrationView({
          viewState: viewState,
          handlers: handlers,
        });
      }
      break;

    default:
      mainView = ErrorView({
        message: `Neznámý typ pohledu: ${viewState.type}`,
        handlers: { onBackToDashboard: handlers.onBackToDashboard },
      });
  }


  root.appendChild(mainView);


  const { notification } = state.ui;
  if (notification) {
    showNotification(root, notification);
  }
}

let activeNotifications = 0;
const MAX_NOTIFICATIONS = 3;


/**
 * Zobrazí notifikaci (toast)
 * @param {HTMLElement} root - Kořenový element
 * @param {Object} notification - Objekt notifikace {type, message}
 */
function showNotification(root, notification) {
  if (activeNotifications >= MAX_NOTIFICATIONS) {
    const notifications = root.querySelectorAll('.notification');
    if (notifications.length > 0) {
      notifications[0].remove();
      activeNotifications--;
    }
  }

  const notificationElement = document.createElement("div");
  notificationElement.className = `notification notification-${notification.type.toLowerCase()}`;
  notificationElement.textContent = notification.message;


  root.appendChild(notificationElement);

  activeNotifications++;
  setTimeout(() => {
    notificationElement.classList.add("notification-fading-out");
    setTimeout(() => {
      activeNotifications--;
      notificationElement.remove();
    }, 300); 
  }, 3000);
}