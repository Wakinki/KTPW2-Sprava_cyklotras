// src/api/signApi.js
import { delay } from "./utils.js";

// Stavový automat pro Sign
const SIGN_STATES = {
  DRAFTED: "DRAFTED",
  PROPOSED: "PROPOSED",
  CANCELED: "CANCELED",
  OK: "OK",
  TORN_DOWN: "TORN_DOWN",
};

const VALID_TRANSITIONS = {
  [SIGN_STATES.DRAFTED]: [SIGN_STATES.PROPOSED, SIGN_STATES.CANCELED],
  [SIGN_STATES.PROPOSED]: [SIGN_STATES.CANCELED, SIGN_STATES.OK],
  [SIGN_STATES.CANCELED]: [],
  [SIGN_STATES.OK]: [SIGN_STATES.TORN_DOWN, SIGN_STATES.CANCELED],
  [SIGN_STATES.TORN_DOWN]: [SIGN_STATES.OK, SIGN_STATES.CANCELED],
};

function canTransition(currentState, nextState) {
  return VALID_TRANSITIONS[currentState]?.includes(nextState) ?? false;
}

export function createSignApi(db) {
  return {
    // CRUD

    async getSigns(token) {
      await delay();
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      return { status: "SUCCESS", signs: db.signs };
    },

    async getSign(signId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      return { status: "SUCCESS", sign };
    },

    async createSign(payload, token) {
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      
      const { routeId, location, direction, type } = payload;
      
      const route = db.routes.find((r) => r.id === routeId);
      if (!route) return { status: "REJECTED", reason: "Zadaná trasa neexistuje" };

      const signId = `sign-${Date.now()}`;
      const sign = {
        id: signId,
        routeId,
        location,
        state: SIGN_STATES.DRAFTED,
        direction,
        type: type || "NORMAL",
        createdBy: user.userId,
        createdAt: new Date().toISOString().split("T")[0],
      };

      db.signs.push(sign);
      route.signIds.push(signId);
      return { status: "SUCCESS", sign };
    },

    async updateSign(signId, payload, token) {
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      if (sign.createdBy !== user.userId && user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění editovat tuto značku" };
      }
      if (sign.state === SIGN_STATES.OK || sign.state === SIGN_STATES.TORN_DOWN) {
        return { status: "REJECTED", reason: "Značka ve stavu OK nebo TORN_DOWN nelze editovat" };
      }

      const { location, direction, type } = payload;
      sign.location = location ?? sign.location;
      sign.direction = direction ?? sign.direction;
      sign.type = type ?? sign.type;
      return { status: "SUCCESS", sign };
    },

    async deleteSign(signId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      if (user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění smazat značku" };
      }

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };

      const index = db.signs.findIndex((s) => s.id === signId);
      db.signs.splice(index, 1);

      const route = db.routes.find((r) => r.id === sign.routeId);
      if (route) {
        route.signIds = route.signIds.filter((id) => id !== signId);
      }
      return { status: "SUCCESS" };
    },

    // Stavové přechody
    async proposeSign(signId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      if (user.role === "GUEST") {
        return { status: "REJECTED", reason: "Nemáte oprávnění navrhnout tuto značku" };
      }
      if (!canTransition(sign.state, SIGN_STATES.PROPOSED)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${sign.state} do PROPOSED` };
      }

      sign.state = SIGN_STATES.PROPOSED;
      sign.proposedBy = user.userId;
      sign.proposedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", sign };
    },

    async confirmSign(signId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      if (user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění potvrdit značku" };
      }

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      if (!canTransition(sign.state, SIGN_STATES.OK)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${sign.state} do OK` };
      }

      sign.state = SIGN_STATES.OK;
      sign.confirmedBy = user.userId;
      sign.confirmedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", sign };
    },

    async cancelSign(signId, token) {

      const user = db.users.find((u) => u.token === token);
   
      if (!user) {
        return { status: "REJECTED", reason: "Neplatný token" }
      };

      const sign = db.signs.find((s) => s.id === signId);

      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };

      if (sign.createdBy !== user.userId && user.role !== "ADMINISTRATOR") {
        return { status: "REJECTED", reason: "Nemáte oprávnění zrušit tuto značku" };
      }

      if (!canTransition(sign.state, SIGN_STATES.CANCELED)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${sign.state} do CANCELED` };
      }

      sign.state = SIGN_STATES.CANCELED;
      sign.canceledBy = user.userId;
      sign.canceledAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", sign };
    },

    async reportTornDown(signId, token) {

      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      if (!canTransition(sign.state, SIGN_STATES.TORN_DOWN)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${sign.state} do TORN_DOWN` };
      }

      sign.state = SIGN_STATES.TORN_DOWN;
      sign.tornDownAt = new Date().toISOString().split("T")[0];
      sign.reportedBy = user.userId;
      return { status: "SUCCESS", sign };
    },

    async repairSign(signId, token) {
      await delay();
      const user = db.users.find((u) => u.token === token);
      if (!user) return { status: "REJECTED", reason: "Neplatný token" };
      if (user.role !== "MAINTAINER") {
        return { status: "REJECTED", reason: "Nemáte oprávnění opravit značku" };
      }

      const sign = db.signs.find((s) => s.id === signId);
      if (!sign) return { status: "REJECTED", reason: "Značka nenalezena" };
      if (!canTransition(sign.state, SIGN_STATES.OK)) {
        return { status: "REJECTED", reason: `Nelze přejít ze stavu ${sign.state} do OK` };
      }

      sign.state = SIGN_STATES.OK;
      sign.repairedBy = user.userId;
      sign.repairedAt = new Date().toISOString().split("T")[0];
      return { status: "SUCCESS", sign };
    },
  };
}