// src/infra/store/selectors.js

// ============================================
// DOMAIN DATA SELECTORS
// ============================================

/**
 * Vrací všechny trasy
 */
export function selectRoutes(state) {
  return state.routes ?? [];
}

/**
 * Vrací trasu podle ID z UI stavu
 */
export function selectRouteById(state) {
  const routeId = state.ui.selectedRouteId;
  if (!routeId) return null;
  return state.routes.find((r) => r.id === routeId) ?? null;
}

/**
 * Vrací všechny značky
 */
export function selectSigns(state) {
  return state.signs ?? [];
}

/**
 * Vrací značku podle ID z UI stavu
 */
export function selectSignById(state) {
  const signId = state.ui.selectedSignId;
  if (!signId) return null;
  return state.signs.find((s) => s.id === signId) ?? null;
}

/**
 * Vrací všechny značky patřící k vybrané trase
 */
export function selectSignsByRoute(state) {
  const route = selectRouteById(state);
  if (!route) return [];
  return state.signs.filter((s) => route.signIds.includes(s.id));
}

// ============================================
// CAPABILITY SELECTORS - ROUTES
// ============================================

/**
 * Může vytvářet trasu? (MAINTAINER, ADMINISTRATOR, GUEST)
 * ADMINISTRATOR může vytvářet trasy v DRAFT stavu
 */
export function canCreateRoute(state) {
  const { role } = state.auth;
  return role === "MAINTAINER" || role === "ADMINISTRATOR" || role === "GUEST";
}

/**
 * Může editovat trasu? (vlastník MAINTAINER nebo ADMIN)
 * GUEST nemůže editovat
 */
export function canEditRoute(state) {
  const { role, userId } = state.auth;
  const route = selectRouteById(state);
  if (!route) return false;
  if (role === "ADMINISTRATOR") return true;
  if (role !== "MAINTAINER") return false;
  return route.createdBy === userId &&
         (route.state === "DRAFT" || route.state === "PROPOSED");
}

/**
 * Může smazat trasu? (pouze ADMINISTRATOR)
 * GUEST nemůže
 */
export function canDeleteRoute(state) {
  return state.auth.role === "ADMINISTRATOR";
}

/**
 * Může navrhnout trasu? (DRAFT → PROPOSED)
 * - MAINTAINER: může navrhnout své vlastní trasy v DRAFT
 * - ADMINISTRATOR: může navrhnout JAKOUKOLI trasu v DRAFT
 * - GUEST: nemůže (jeho trasy jsou už v PROPOSED)
 */
export function canProposeRoute(state) {
  const { role, userId } = state.auth;
  const route = selectRouteById(state);
  if (!route) return false;

  // ADMINISTRATOR může navrhnout JAKOUKOLI trasu v DRAFT
  if (role === "ADMINISTRATOR" && route.state === "DRAFT") {
    return true;
  }

  // MAINTAINER může navrhnout pouze svou vlastní trasu v DRAFT
  return role === "MAINTAINER" &&
         route.createdBy === userId &&
         route.state === "DRAFT";
}

/**
 * Může vyznačkovat trasu? (PROPOSED → SIGNED)
 * - MAINTAINER/ADMINISTRATOR: může vyznačkovat JAKOUKOLI trasu v PROPOSED
 * - GUEST: nemůže
 */
export function canSignRoute(state) {
  const { role } = state.auth;
  const route = selectRouteById(state);
  if (!route) return false;
  return (role === "ADMINISTRATOR" || role === "MAINTAINER") && route.state === "PROPOSED";
}

/**
 * Může implementovat trasu? (SIGNED → OFFICIALLY_IMPLEMENTED)
 * - ADMINISTRATOR: může implementovat JAKOUKOLI trasu v SIGNED
 * - MAINTAINER/GUEST: nemůže
 */
export function canImplementRoute(state) {
  const { role } = state.auth;
  const route = selectRouteById(state);
  if (!route) return false;
  if (role !== "ADMINISTRATOR") return false;
  if (route.state !== "SIGNED") return false;

  const allSignsOk = route.signIds.every(signId => {
    const sign = state.signs.find(s => s.id === signId);
    return sign && sign.state === "OK";
  });
  return allSignsOk;
}

// ============================================
// CAPABILITY SELECTORS - SIGNS (upraveno pro GUEST)
// ============================================

/**
 * Může vytvářet značku? (MAINTAINER, ADMINISTRATOR, GUEST)
 */
export function canCreateSign(state) {
  const { role } = state.auth;
  return role === "MAINTAINER" || role === "ADMINISTRATOR" || role === "GUEST";
}

/**
 * Může editovat značku? (vlastník MAINTAINER nebo ADMIN)
 * GUEST nemůže editovat
 */
export function canEditSign(state) {
  const { role, userId } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;
  if (role === "ADMINISTRATOR") return true;
  if (role !== "MAINTAINER") return false;
  return sign.createdBy === userId &&
         (sign.state === "DRAFTED" || sign.state === "PROPOSED");
}

/**
 * Může smazat značku? (pouze ADMINISTRATOR)
 * GUEST nemůže
 */
export function canDeleteSign(state) {
  return state.auth.role === "ADMINISTRATOR";
}

/**
 * Může navrhnout značku? (MAINTAINER, ADMINISTRATOR)
 * ADMINISTRATOR může navrhovat jakoukoli značku
 */
export function canProposeSign(state) {
  const { role, userId } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;

  // ADMINISTRATOR může navrhovat jakoukoli značku
  if (role === "ADMINISTRATOR") return sign.state === "DRAFTED";

  // MAINTAINER může navrhovat pouze své značky
  return role === "MAINTAINER" &&
         sign.createdBy === userId &&
         sign.state === "DRAFTED";
}

/**
 * Může potvrdit značku? (MAINTAINER nebo ADMINISTRATOR)
 * GUEST nemůže
 */
export function canConfirmSign(state) {
  const { role } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;
  return (role === "ADMINISTRATOR" || role === "MAINTAINER") && sign.state === "PROPOSED";
}

/**
 * Může zrušit značku? (MAINTAINER nebo ADMINISTRATOR)
 * GUEST nemůže
 */
export function canCancelSign(state) {
  const { role, userId } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;
  if (role === "ADMINISTRATOR") return true;
  if (role !== "MAINTAINER") return false;
  return sign.createdBy === userId &&
         (sign.state === "DRAFTED");
}

/**
 * Může nahlásit strženou značku? (MAINTAINER, ADMINISTRATOR, GUEST)
 * GUEST může nahlásit, ale nemůže opravit
 */
export function canReportTornDown(state) {
  const { role } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;
  return (role === "MAINTAINER" || role === "ADMINISTRATOR" || role === "GUEST") &&
         sign.state === "OK";
}

/**
 * Může opravit značku? (MAINTAINER, ADMINISTRATOR)
 */
export function canRepairSign(state) {
  const { role } = state.auth;
  const sign = selectSignById(state);
  if (!sign) return false;
  return (role === "MAINTAINER" || role === "ADMINISTRATOR") &&
         sign.state === "TORN_DOWN";
}

// ============================================
// VIEW STATE SELECTORS
// ============================================

/**
 * Vrací pohled pro seznam tras
 */
export function selectRouteListView(state) {
  const routes = selectRoutes(state);

  const { role } = state.auth;

  return {
    type: "ROUTE_LIST",
    routes,
    capabilities: {
      canEnterDetail: true,
      canEnterAdministration: role === "MAINTAINER" || role === "ADMINISTRATOR",
      canCreateRoute: canCreateRoute(state),
      canEnterSignList: true,
    },
  };
}

/**
 * Vrací pohled pro detail trasy
 */
export function selectRouteDetailView(state) {
  const route = selectRouteById(state);
  const signs = selectSignsByRoute(state);

  return {
    type: "ROUTE_DETAIL",
    route,
    signs,
    capabilities: {
      canBackToList: true,
      canEnterAdministration: canEditRoute(state) || canSignRoute(state) || canImplementRoute(state),
      canPropose: canProposeRoute(state),
      canSign: canSignRoute(state),
      canImplement: canImplementRoute(state),
      canEdit: canEditRoute(state),
      canDelete: canDeleteRoute(state),
    },
  };
}

/**
 * Vrací pohled pro administraci trasy
 */
export function selectRouteAdministrationView(state) {
  const { role } = state.auth;
  const route = selectRouteById(state);

  // Kontrola oprávnění
  if (role !== "MAINTAINER" && role !== "ADMINISTRATOR") {
    return {
      type: "ERROR",
      message: "Nemáte oprávnění zobrazit tento pohled.",
    };
  }

  if (!route) {
    return {
      type: "ERROR",
      message: "Trasa nebyla nalezena.",
    };
  }

  return {
    type: "ROUTE_ADMINISTRATION",
    route,
    capabilities: {
      canBackToList: true,
      canBackToDetail: true,
      canEdit: canEditRoute(state),
      canDelete: canDeleteRoute(state),
      canPropose: canProposeRoute(state),
      canSign: canSignRoute(state),
      canImplement: canImplementRoute(state),
    },
  };
}

/**
 * Vrací pohled pro seznam značek
 */
export function selectSignListView(state) {
  const signs = selectSigns(state);
  const { role } = state.auth;

  return {
    type: "SIGN_LIST",
    signs,
    capabilities: {
      canBackToDashboard: true,
      canEnterDetail: true,
      canEnterAdministration: role === "MAINTAINER" || role === "ADMINISTRATOR",
      canCreateSign: canCreateSign(state),
      canEnterRouteList: true,
    },
  };
}

/**
 * Vrací pohled pro detail značky
 */
export function selectSignDetailView(state) {
  const sign = selectSignById(state);
  const route = sign ? state.routes.find((r) => r.id === sign.routeId) : null;

  return {
    type: "SIGN_DETAIL",
    sign,
    route,
    capabilities: {
      canBackToList: true,
      canEnterAdministration: canEditSign(state) || canConfirmSign(state) || canCancelSign(state) || canReportTornDown(state) || canRepairSign(state),
      canPropose: canProposeSign(state),
      canConfirm: canConfirmSign(state),
      canCancel: canCancelSign(state),
      canReportTornDown: canReportTornDown(state),
      canRepair: canRepairSign(state),
      canEdit: canEditSign(state),
      canDelete: canDeleteSign(state),
    },
  };
}

/**
 * Vrací pohled pro administraci značky
 */
export function selectSignAdministrationView(state) {
  const { role } = state.auth;
  const sign = selectSignById(state);

  // Kontrola oprávnění
  if (role !== "MAINTAINER" && role !== "ADMINISTRATOR") {
    return {
      type: "ERROR",
      message: "Nemáte oprávnění zobrazit tento pohled.",
    };
  }

  if (!sign) {
    return {
      type: "ERROR",
      message: "Značka nebyla nalezena.",
    };
  }

  return {
    type: "SIGN_ADMINISTRATION",
    sign,
    capabilities: {
      canBackToList: true,
      canBackToDetail: true,
      canEdit: canEditSign(state),
      canDelete: canDeleteSign(state),
      canPropose: canProposeSign(state),
      canConfirm: canConfirmSign(state),
      canCancel: canCancelSign(state),
      canReportTornDown: canReportTornDown(state),
      canRepair: canRepairSign(state),
    },
  };
}

/**
 * Vrací pohled pro dashboard podle role
 */
export function selectDashboardView(state) {
  const { role, username ,userId } = state.auth;
  const routes = selectRoutes(state);
  const signs = selectSigns(state);

  const base = {
    type: "DASHBOARD",
    role,
    username,
    capabilities: {
      canEnterRouteList: true,
      canEnterSignList: true,
    },
  };

  // Statistiky pro MAINTAINER
  if (role === "MAINTAINER") {
    const myRoutes = routes.filter((r) => r.createdBy === userId);
    const draftRoutes = myRoutes.filter((r) => r.state === "DRAFT");
    const proposedRoutes = myRoutes.filter((r) => r.state === "PROPOSED");
    const signedRoutes = myRoutes.filter((r) => r.state === "SIGNED");
    const implementedRoutes = myRoutes.filter((r) => r.state === "OFFICIALLY_IMPLEMENTED");

    const mySigns = signs.filter((s) => s.createdBy === userId);
    const draftedSigns = mySigns.filter((s) => s.state === "DRAFTED");
    const proposedSigns = mySigns.filter((s) => s.state === "PROPOSED");
    const okSigns = mySigns.filter((s) => s.state === "OK");
    const tornDownSigns = mySigns.filter((s) => s.state === "TORN_DOWN");

    return {
      ...base,
      summary: {
        myRoutesCount: myRoutes.length,
        draftRoutesCount: draftRoutes.length,
        proposedRoutesCount: proposedRoutes.length,
        signedRoutesCount: signedRoutes.length,
        implementedRoutesCount: implementedRoutes.length,
        mySignsCount: mySigns.length,
        draftedSignsCount: draftedSigns.length,
        proposedSignsCount: proposedSigns.length,
        okSignsCount: okSigns.length,
        tornDownSignsCount: tornDownSigns.length,
      },
    };
  }

  // Statistiky pro ADMINISTRATOR
  if (role === "ADMINISTRATOR") {
    const draftRoutes = routes.filter((r) => r.state === "DRAFT");
    const proposedRoutes = routes.filter((r) => r.state === "PROPOSED");
    const signedRoutes = routes.filter((r) => r.state === "SIGNED");
    const implementedRoutes = routes.filter((r) => r.state === "OFFICIALLY_IMPLEMENTED");

    const draftedSigns = signs.filter((s) => s.state === "DRAFTED");
    const proposedSigns = signs.filter((s) => s.state === "PROPOSED");
    const canceledSigns = signs.filter((s) => s.state === "CANCELED");
    const okSigns = signs.filter((s) => s.state === "OK");
    const tornDownSigns = signs.filter((s) => s.state === "TORN_DOWN");

    return {
      ...base,
      summary: {
        draftRoutesCount: draftRoutes.length,
        proposedRoutesCount: proposedRoutes.length,
        signedRoutesCount: signedRoutes.length,
        implementedRoutesCount: implementedRoutes.length,
        draftedSignsCount: draftedSigns.length,
        proposedSignsCount: proposedSigns.length,
        canceledSignsCount: canceledSigns.length,
        okSignsCount: okSigns.length,
        tornDownSignsCount: tornDownSigns.length,
      },
    };
  }

  // Pro ANONYMOUS (nepřihlášený)
  return base;
}

/**
 * Vrací pohled pro autentizaci
 */
export function selectAuthenticationView(state) {
  const { role, userId, token } = state.auth;
  // Opraveno: Správné určení, zda je uživatel přihlášen
  const isLoggedIn = role !== "ANONYMOUS" && userId !== null && token !== null;

  return {
    type: "AUTHENTICATION",
    isLoggedIn,
    role,
    capabilities: {
      canLogin: !isLoggedIn,
      canRegister: !isLoggedIn,
      canLogout: isLoggedIn,
    },
  };
}

// ============================================
// MAIN VIEW STATE SELECTOR
// ============================================

/**
 * Hlavní funkce pro určování aktuálního pohledu aplikace
 * @param {Object} state - Globální stav aplikace
 * @returns {Object} View state objekt
 */
export function selectViewState(state) {
  const { status, message, mode } = state.ui;

  // Technický stav
  if (status === "LOADING") {
    return { type: "LOADING" };
  }

  if (status === "ERROR") {
    return { type: "ERROR", message: message || "Neznámá chyba" };
  }

  if (status !== "READY") {
    return { type: "ERROR", message: `Neznámý stav UI: ${status}` };
  }

  // Navigační mód
  switch (mode) {
    case "AUTHENTICATION":
      return selectAuthenticationView(state);

    case "DASHBOARD":
      return selectDashboardView(state);

    // Route views
    case "ROUTE_LIST":
      return selectRouteListView(state);
    case "ROUTE_DETAIL":
      return selectRouteDetailView(state);
    case "ROUTE_ADMINISTRATION":
      return selectRouteAdministrationView(state);

    // Sign views
    case "SIGN_LIST":
      return selectSignListView(state);
    case "SIGN_DETAIL":
      return selectSignDetailView(state);
    case "SIGN_ADMINISTRATION":
      return selectSignAdministrationView(state);

    // Fallback
    default:
      return { type: "ERROR", message: `Neznámý mód: ${mode}` };
  }
}