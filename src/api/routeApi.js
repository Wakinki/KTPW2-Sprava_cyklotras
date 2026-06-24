// src/api/routeApi.js
import { delay } from "./utils.js";

// Stavový automat pro Route
const ROUTE_STATES = {
  DRAFT: "DRAFT",
  PROPOSED: "PROPOSED",
  SIGNED: "SIGNED",
  OFFICIALLY_IMPLEMENTED: "OFFICIALLY_IMPLEMENTED",
};

const VALID_TRANSITIONS = {
  [ROUTE_STATES.DRAFT]: [ROUTE_STATES.PROPOSED],
  [ROUTE_STATES.PROPOSED]: [ROUTE_STATES.DRAFT, ROUTE_STATES.SIGNED],
  [ROUTE_STATES.SIGNED]: [ROUTE_STATES.PROPOSED, ROUTE_STATES.OFFICIALLY_IMPLEMENTED],
  [ROUTE_STATES.OFFICIALLY_IMPLEMENTED]: [],
};

function canTransition(currentState, nextState) {
  return VALID_TRANSITIONS[currentState]?.includes(nextState) ?? false;
}

export function createRouteApi(db) {
  return {
    // CRUD
    async getRoutes(token) {
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      return { status: "SUCCESS", routes: db.routes };
    },

    async getRoute(routeId, token) {
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };
      return { status: "SUCCESS", route };
    },

    async createRoute(payload, token) {
      const user = db.users.find((u) => u.token === token);
    if (!user) {
      return { status: "REJECTED", reason: "Neplatný token" };
    }

    const { name, description,} = payload;
    const routeId = `route-${Date.now()}`;

    const initialState = user.role === "GUEST" ? "PROPOSED" : "DRAFT";

  const route = {
    id: routeId,
    name,
    description,
    state: initialState,
    createdBy: user.userId,
    createdAt: new Date().toISOString().split("T")[0],
    signIds: [],
  };

  db.routes.push(route);
  return { status: "SUCCESS", route };
    },

    async updateRoute(routeId, payload, token) {
      await delay();
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };

      if (route.createdBy !== user.userId && user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění editovat tuto trasu" };
      }

      if (route.state === ROUTE_STATES.SIGNED || route.state === ROUTE_STATES.OFFICIALLY_IMPLEMENTED) {
        return { status: "REJECTED", reason: "Trasa ve stavu SIGNED nebo OFFICIALLY_IMPLEMENTED nelze editovat" };
      }

      const { name, description,} = payload;
      route.name = name ?? route.name;
      route.description = description ?? route.description;

      return { status: "SUCCESS", route };
    },

    async deleteRoute(routeId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      if (user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění smazat trasu" };
      }

      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };
      if (route.signIds.length > 0) {
        return { status: "REJECTED", reason: "Trasa s značkami nelze smazat" };
      }

      const index = db.routes.findIndex((r) => r.id === routeId);
      db.routes.splice(index, 1);
      return { status: "SUCCESS" };
    },

    // Stavové přechody
    async proposeRoute(routeId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };

      if (user.role === "ADMINISTRATOR") {
        if (route.state !== "DRAFT") {
          return { status: "REJECTED", reason: `Nelze přejít ze stavu ${route.state} do PROPOSED` };
        }
      } else {

        if (route.createdBy !== user.userId || route.state !== "DRAFT") {
          return { status: "REJECTED", reason: "Nemáte oprávnění navrhnout tuto trasu" };
        }
      }

      route.state = ROUTE_STATES.PROPOSED;
      route.proposedBy = user.userId;
      route.proposedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", route };
    },

    async signRoute(routeId, token) {
      await delay();
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      if (user.role !== "ADMINISTRATOR" && user.role !== "MAINTAINER") {
        return { status: "REJECTED", reason: "Nemáte oprávnění vyznačkovat trasu" };
      }

      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };
      if (!canTransition(route.state, ROUTE_STATES.SIGNED)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${route.state} do SIGNED` };
      }

      route.state = ROUTE_STATES.SIGNED;
      route.signedBy = user.userId;
      route.signedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", route };
    },

    async implementRoute(routeId, token) {
      await delay();
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      if (user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění implementovat trasu" };
      }

      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Trasa nenalezena" };
      if (!canTransition(route.state, ROUTE_STATES.OFFICIALLY_IMPLEMENTED)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${route.state} do OFFICIALLY_IMPLEMENTED` };
      }

      const allSignsOk = route.signIds.every((signId) => {
        const sign = db.signs.find((s) => s.id === signId);
        return sign && sign.state === "OK";
      });
      if (!allSignsOk) {
        return { status: "REJECTED", reason: "Ne všechny značky trasy jsou v pořádku" };
      }

      route.state = ROUTE_STATES.OFFICIALLY_IMPLEMENTED;
      route.implementedBy = user.userId;
      route.implementedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", route };
    },
  };
}