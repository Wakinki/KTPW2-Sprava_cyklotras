// tests/handlers/handlers.test.mjs
//
// Spuštění: node tests/handlers/handlers.test.mjs
//
// Testy továren ovladačů: scheduleEventListHandlers, scheduleEventDetailHandlers,
// scheduleEventAdministrationHandlers, authenticationHandlers,
// createNavigationPanelHandlers.
//
// Testujeme:
// 1. handler je přítomen pokud capability je true
// 2. handler chybí pokud capability je false
// 3. handler volá dispatch se správnou akcí a payloadem

import { assert } from "../assert.js";
import { scheduleEventListHandlers } from "../../src/app/actionHandlers/scheduleEventListHandlers.js";
import { scheduleEventDetailHandlers } from "../../src/app/actionHandlers/scheduleEventDetailHandlers.js";
import { scheduleEventAdministrationHandlers } from "../../src/app/actionHandlers/scheduleEventAdministrationHandlers.js";
import { authenticationHandlers } from "../../src/app/actionHandlers/authenticationHandlers.js";
import { createNavigationPanelHandlers } from "../../src/app/actionHandlers/navigationPanelHandlers.js";

// pomocná funkce pro zachycení dispatch volání
function createDispatchSpy() {
  const calls = [];
  const dispatch = (action) => calls.push(action);
  return { dispatch, calls };
}

// =====================================================================
// scheduleEventListHandlers
// =====================================================================

console.log("\n── scheduleEventListHandlers ──");

// všechny capabilities true – všechny handlers přítomny
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_LIST",
    scheduleEvents: [],
    capabilities: {
      canBackToDashboard: true,
      canEnterDetail: true,
      canEnterAdministration: true,
      canCreateScheduleEvent: true,
    },
  };

  const handlers = scheduleEventListHandlers(dispatch, viewState);

  assert(typeof handlers.onBackToDashboard === "function", "scheduleEventListHandlers: onBackToDashboard je přítomen");
  assert(typeof handlers.onEnterDetail === "function", "scheduleEventListHandlers: onEnterDetail je přítomen");
  assert(typeof handlers.onEnterAdministration === "function", "scheduleEventListHandlers: onEnterAdministration je přítomen");
  assert(typeof handlers.onCreateScheduleEvent === "function", "scheduleEventListHandlers: onCreateScheduleEvent je přítomen");
}

// canCreateScheduleEvent false – onCreateScheduleEvent chybí
{
  const { dispatch } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_LIST",
    scheduleEvents: [],
    capabilities: {
      canBackToDashboard: true,
      canEnterDetail: true,
      canEnterAdministration: true,
      canCreateScheduleEvent: false,
    },
  };

  const handlers = scheduleEventListHandlers(dispatch, viewState);
  assert(handlers.onCreateScheduleEvent === undefined, "scheduleEventListHandlers: onCreateScheduleEvent chybí pokud canCreateScheduleEvent je false");
}

// canEnterAdministration false – onEnterAdministration chybí
{
  const { dispatch } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_LIST",
    scheduleEvents: [],
    capabilities: {
      canBackToDashboard: true,
      canEnterDetail: true,
      canEnterAdministration: false,
      canCreateScheduleEvent: false,
    },
  };

  const handlers = scheduleEventListHandlers(dispatch, viewState);
  assert(handlers.onEnterAdministration === undefined, "scheduleEventListHandlers: onEnterAdministration chybí pokud canEnterAdministration je false");
}

// onEnterDetail volá dispatch se správným payloadem
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_LIST",
    scheduleEvents: [],
    capabilities: {
      canBackToDashboard: false,
      canEnterDetail: true,
      canEnterAdministration: false,
      canCreateScheduleEvent: false,
    },
  };

  const handlers = scheduleEventListHandlers(dispatch, viewState);
  handlers.onEnterDetail("se-42");

  assert(calls.length === 1, "scheduleEventListHandlers: onEnterDetail zavolá dispatch");
  assert(calls[0].type === "ENTER_SCHEDULE_EVENT_DETAIL", "scheduleEventListHandlers: onEnterDetail → ENTER_SCHEDULE_EVENT_DETAIL");
  assert(calls[0].payload.scheduleEventId === "se-42", "scheduleEventListHandlers: onEnterDetail předá správné scheduleEventId");
}

// =====================================================================
// scheduleEventDetailHandlers
// =====================================================================

console.log("\n── scheduleEventDetailHandlers ──");

// STUDENT s canEnroll – onEnroll je přítomen
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_DETAIL",
    scheduleEvent: { id: "se-1" },
    capabilities: {
      canBackToList: true,
      canEnroll: true,
      canCancelEnrollment: false,
      canOpen: false,
      canCancelScheduleEvent: false,
    },
  };

  const handlers = scheduleEventDetailHandlers(dispatch, viewState);
  assert(typeof handlers.onEnroll === "function", "scheduleEventDetailHandlers: onEnroll je přítomen");
  assert(handlers.onCancelEnrollment === undefined, "scheduleEventDetailHandlers: onCancelEnrollment chybí");
  assert(handlers.onOpen === undefined, "scheduleEventDetailHandlers: onOpen chybí");

  handlers.onEnroll();
  assert(calls[0].type === "ENROLL", "scheduleEventDetailHandlers: onEnroll → ENROLL");
  assert(calls[0].payload.scheduleEventId === "se-1", "scheduleEventDetailHandlers: onEnroll předá správné scheduleEventId");
}

// TEACHER s canOpen – onOpen je přítomen
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_DETAIL",
    scheduleEvent: { id: "se-1" },
    capabilities: {
      canBackToList: true,
      canEnroll: false,
      canCancelEnrollment: false,
      canOpen: true,
      canCancelScheduleEvent: false,
    },
  };

  const handlers = scheduleEventDetailHandlers(dispatch, viewState);
  assert(typeof handlers.onOpen === "function", "scheduleEventDetailHandlers: onOpen je přítomen");
  assert(handlers.onEnroll === undefined, "scheduleEventDetailHandlers: onEnroll chybí");

  handlers.onOpen();
  assert(calls[0].type === "OPEN_SCHEDULE_EVENT", "scheduleEventDetailHandlers: onOpen → OPEN_SCHEDULE_EVENT");
  assert(calls[0].payload.scheduleEventId === "se-1", "scheduleEventDetailHandlers: onOpen předá správné scheduleEventId");
}

// bez scheduleEvent – jen onBackToList
{
  const { dispatch } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_DETAIL",
    scheduleEvent: null,
    capabilities: {
      canBackToList: true,
      canEnroll: true,
      canCancelEnrollment: true,
      canOpen: true,
      canCancelScheduleEvent: true,
    },
  };

  const handlers = scheduleEventDetailHandlers(dispatch, viewState);
  assert(typeof handlers.onBackToList === "function", "scheduleEventDetailHandlers: onBackToList je přítomen i bez scheduleEvent");
  assert(handlers.onEnroll === undefined, "scheduleEventDetailHandlers: onEnroll chybí bez scheduleEvent");
  assert(handlers.onOpen === undefined, "scheduleEventDetailHandlers: onOpen chybí bez scheduleEvent");
}

// =====================================================================
// scheduleEventAdministrationHandlers
// =====================================================================

console.log("\n── scheduleEventAdministrationHandlers ──");

// TEACHER – onUpdateDetails a onUpdateMaximalCapacity přítomny
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_ADMINISTRATION",
    scheduleEvent: { id: "se-1" },
    capabilities: {
      canBackToList: true,
      canUpdateDetails: true,
      canUpdateMaximalCapacity: true,
      canUpdateCapacity: false,
      canDeleteScheduleEvent: false,
    },
  };

  const handlers = scheduleEventAdministrationHandlers(dispatch, viewState);
  assert(typeof handlers.onUpdateDetails === "function", "scheduleEventAdministrationHandlers TEACHER: onUpdateDetails je přítomen");
  assert(typeof handlers.onUpdateMaximalCapacity === "function", "scheduleEventAdministrationHandlers TEACHER: onUpdateMaximalCapacity je přítomen");
  assert(handlers.onUpdateCapacity === undefined, "scheduleEventAdministrationHandlers TEACHER: onUpdateCapacity chybí");
  assert(handlers.onDelete === undefined, "scheduleEventAdministrationHandlers TEACHER: onDelete chybí");

  handlers.onUpdateDetails({ name: "Nový název", time: "2027-01-01T10:00:00" });
  assert(calls[0].type === "UPDATE_SCHEDULE_EVENT_DETAILS", "scheduleEventAdministrationHandlers: onUpdateDetails → UPDATE_SCHEDULE_EVENT_DETAILS");
  assert(calls[0].payload.scheduleEventId === "se-1", "scheduleEventAdministrationHandlers: onUpdateDetails předá správné scheduleEventId");
}

// SCHEDULER – onUpdateCapacity a onDelete přítomny
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "SCHEDULE_EVENT_ADMINISTRATION",
    scheduleEvent: { id: "se-1" },
    capabilities: {
      canBackToList: true,
      canUpdateDetails: true,
      canUpdateMaximalCapacity: false,
      canUpdateCapacity: true,
      canDeleteScheduleEvent: true,
    },
  };

  const handlers = scheduleEventAdministrationHandlers(dispatch, viewState);
  assert(typeof handlers.onUpdateCapacity === "function", "scheduleEventAdministrationHandlers SCHEDULER: onUpdateCapacity je přítomen");
  assert(typeof handlers.onDelete === "function", "scheduleEventAdministrationHandlers SCHEDULER: onDelete je přítomen");
  assert(handlers.onUpdateMaximalCapacity === undefined, "scheduleEventAdministrationHandlers SCHEDULER: onUpdateMaximalCapacity chybí");

  handlers.onUpdateCapacity(15);
  assert(calls[0].type === "UPDATE_SCHEDULE_EVENT_CAPACITY", "scheduleEventAdministrationHandlers: onUpdateCapacity → UPDATE_SCHEDULE_EVENT_CAPACITY");
  assert(calls[0].payload.capacity === 15, "scheduleEventAdministrationHandlers: onUpdateCapacity předá správnou capacity");

  handlers.onDelete();
  assert(calls[1].type === "DELETE_SCHEDULE_EVENT", "scheduleEventAdministrationHandlers: onDelete → DELETE_SCHEDULE_EVENT");
  assert(calls[1].payload.scheduleEventId === "se-1", "scheduleEventAdministrationHandlers: onDelete předá správné scheduleEventId");
}

// =====================================================================
// authenticationHandlers
// =====================================================================

console.log("\n── authenticationHandlers ──");

// nepřihlášený – canLogin a canRegister
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "AUTHENTICATION",
    isLoggedIn: false,
    capabilities: {
      canLogin: true,
      canRegister: true,
      canLogout: false,
    },
  };

  const handlers = authenticationHandlers(dispatch, viewState);
  assert(typeof handlers.onLogin === "function", "authenticationHandlers: onLogin je přítomen");
  assert(typeof handlers.onRegister === "function", "authenticationHandlers: onRegister je přítomen");
  assert(handlers.onLogout === undefined, "authenticationHandlers: onLogout chybí");

  handlers.onLogin({ username: "novak", password: "heslo123" });
  assert(calls[0].type === "LOGIN", "authenticationHandlers: onLogin → LOGIN");
  assert(calls[0].payload.username === "novak", "authenticationHandlers: onLogin předá správný payload");

  handlers.onRegister({ username: "novak", password: "heslo123", role: "STUDENT" });
  assert(calls[1].type === "REGISTER", "authenticationHandlers: onRegister → REGISTER");
  assert(calls[1].payload.role === "STUDENT", "authenticationHandlers: onRegister předá správný payload");
}

// přihlášený – jen canLogout
{
  const { dispatch, calls } = createDispatchSpy();
  const viewState = {
    type: "AUTHENTICATION",
    isLoggedIn: true,
    capabilities: {
      canLogin: false,
      canRegister: false,
      canLogout: true,
    },
  };

  const handlers = authenticationHandlers(dispatch, viewState);
  assert(handlers.onLogin === undefined, "authenticationHandlers: onLogin chybí");
  assert(handlers.onRegister === undefined, "authenticationHandlers: onRegister chybí");
  assert(typeof handlers.onLogout === "function", "authenticationHandlers: onLogout je přítomen");

  handlers.onLogout();
  assert(calls[0].type === "LOGOUT", "authenticationHandlers: onLogout → LOGOUT");
}

// =====================================================================
// createNavigationPanelHandlers
// =====================================================================

console.log("\n── createNavigationPanelHandlers ──");

// vrátí handlers pro navigaci – vždy přítomny
{
  const { dispatch, calls } = createDispatchSpy();
  const handlers = createNavigationPanelHandlers(dispatch);

  assert(typeof handlers.onEnterExamTermList === "function", "createNavigationPanelHandlers: onEnterExamTermList je přítomen");
  assert(typeof handlers.onEnterScheduleEventList === "function", "createNavigationPanelHandlers: onEnterScheduleEventList je přítomen");

  handlers.onEnterExamTermList();
  assert(calls[0].type === "ENTER_EXAM_TERM_LIST", "createNavigationPanelHandlers: onEnterExamTermList → ENTER_EXAM_TERM_LIST");

  handlers.onEnterScheduleEventList();
  assert(calls[1].type === "ENTER_SCHEDULE_EVENT_LIST", "createNavigationPanelHandlers: onEnterScheduleEventList → ENTER_SCHEDULE_EVENT_LIST");
}

console.log("\n── Hotovo ──\n");
