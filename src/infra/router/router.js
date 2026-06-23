// src/infra/router/router.js

// URL -> route
export function urlToRoute(url) {
  const hashIndex = url.indexOf("#");
  const path = hashIndex >= 0 ? url.slice(hashIndex + 1) : "";
  return parseUrl(path);
}

// Parsování cesty
export function parseUrl(path) {
  const parts = path.split("/").filter(Boolean);

  // #/ (prázdné)
  if (parts.length === 0) {
    return { context: "DASHBOARD" };
  }

  // #/auth
  if (parts.length === 1 && parts[0] === "auth") {
    return { context: "AUTHENTICATION" };
  }

  // ========== ROUTES ==========
  // #/routes
  if (parts.length === 1 && parts[0] === "routes") {
    return { context: "ROUTE_LIST" };
  }

  // #/routes/:routeId
  if (parts.length === 2 && parts[0] === "routes") {
    return {
      context: "ROUTE_DETAIL",
      routeId: parts[1],
    };
  }

  // #/routes/:routeId/edit
  if (parts.length === 3 && parts[0] === "routes" && parts[2] === "edit") {
    return {
      context: "ROUTE_ADMINISTRATION",
      routeId: parts[1],
    };
  }

  /* // ========== SIGNS ==========
  // #/signs
  if (parts.length === 1 && parts[0] === "signs") {
    return { context: "SIGN_LIST" };
  }

  // #/signs/:signId
  if (parts.length === 2 && parts[0] === "signs") {
    return {
      context: "SIGN_DETAIL",
      signId: parts[1],
    };
  }

  // #/signs/:signId/edit
  if (parts.length === 3 && parts[0] === "signs" && parts[2] === "edit") {
    return {
      context: "SIGN_ADMINISTRATION",
      signId: parts[1],
    };
  } */

  // Neznámá cesta
  return { context: "UNKNOWN" };
}

// Route -> navigační akce
export function routeToAction(route) {
  switch (route.context) {
    case "DASHBOARD":
      return { type: "ENTER_DASHBOARD" };

    case "AUTHENTICATION":
      return { type: "ENTER_AUTHENTICATION" };

    // Routes
    case "ROUTE_LIST":
      return { type: "ENTER_ROUTE_LIST" };

    case "ROUTE_DETAIL":
      return {
        type: "ENTER_ROUTE_DETAIL",
        payload: { routeId: route.routeId },
      };

    case "ROUTE_ADMINISTRATION":
      return {
        type: "ENTER_ROUTE_ADMINISTRATION",
        payload: { routeId: route.routeId },
      };

    // Signs
    case "SIGN_LIST":
      return { type: "ENTER_SIGN_LIST" };

    case "SIGN_DETAIL":
      return {
        type: "ENTER_SIGN_DETAIL",
        payload: { signId: route.signId },
      };

    case "SIGN_ADMINISTRATION":
      return {
        type: "ENTER_SIGN_ADMINISTRATION",
        payload: { signId: route.signId },
      };

    case "UNKNOWN":
    default:
      return { type: "ENTER_DASHBOARD" };
  }
}

// URL -> akce (hlavní funkce)
export function urlToAction(url) {
  const route = urlToRoute(url);
  return routeToAction(route);
}