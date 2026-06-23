// tests/actions/navigational.actions.test.mjs
//
// Spuštění: node tests/actions/navigational.actions.test.mjs
//
// Testy navigačních akcí pro doménu rozvrhových akcí, dashboard a autentizaci.
// Navigační akce jsou synchronní – testujeme pouze správnou změnu ui stavu.

import { assert } from "../assert.js";
import { createStore } from "../../src/infra/store/createStore.js";

import { enterDashboard } from "../../src/app/actions/enterDashboard.js";
import { enterAuthentication } from "../../src/app/actions/enterAuthentication.js";
import { enterScheduleEventList } from "../../src/app/actions/enterScheduleEventList.js";
import { enterScheduleEventDetail } from "../../src/app/actions/enterScheduleEventDetail.js";
import { enterScheduleEventAdministration } from "../../src/app/actions/enterScheduleEventAdministration.js";

// =====================================================================
// enterDashboard
// =====================================================================

console.log("\n── enterDashboard ──");

// nastaví mode na DASHBOARD a vynuluje selectedId
{
  const store = createStore({
    ui: {
      mode: "EXAM_TERM_LIST",
      selectedExamId: "exam-1",
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterDashboard({ store });

  const state = store.getState();
  assert(state.ui.mode === "DASHBOARD", "enterDashboard: mode je DASHBOARD");
  assert(state.ui.selectedExamId === null, "enterDashboard: selectedExamId je null");
  assert(state.ui.selectedScheduleEventId === null, "enterDashboard: selectedScheduleEventId je null");
}

// zachová ostatní části stavu beze změny
{
  const store = createStore({
    ui: {
      mode: "EXAM_TERM_LIST",
      selectedExamId: null,
      selectedScheduleEventId: null,
      status: "READY",
      notification: null,
    },
  });

  enterDashboard({ store });

  const state = store.getState();
  assert(state.ui.status === "READY", "enterDashboard: status zůstává READY");
  assert(state.ui.notification === null, "enterDashboard: notification zůstává null");
}

// =====================================================================
// enterAuthentication
// =====================================================================

console.log("\n── enterAuthentication ──");

// nastaví mode na AUTHENTICATION a vynuluje selectedId
{
  const store = createStore({
    ui: {
      mode: "DASHBOARD",
      selectedExamId: "exam-1",
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterAuthentication({ store });

  const state = store.getState();
  assert(state.ui.mode === "AUTHENTICATION", "enterAuthentication: mode je AUTHENTICATION");
  assert(state.ui.selectedExamId === null, "enterAuthentication: selectedExamId je null");
  assert(state.ui.selectedScheduleEventId === null, "enterAuthentication: selectedScheduleEventId je null");
}

// =====================================================================
// enterScheduleEventList
// =====================================================================

console.log("\n── enterScheduleEventList ──");

// nastaví mode na SCHEDULE_EVENT_LIST a vynuluje selectedScheduleEventId
{
  const store = createStore({
    ui: {
      mode: "SCHEDULE_EVENT_DETAIL",
      selectedExamId: null,
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventList({ store });

  const state = store.getState();
  assert(state.ui.mode === "SCHEDULE_EVENT_LIST", "enterScheduleEventList: mode je SCHEDULE_EVENT_LIST");
  assert(state.ui.selectedScheduleEventId === null, "enterScheduleEventList: selectedScheduleEventId je null");
}

// zachová selectedExamId beze změny
{
  const store = createStore({
    ui: {
      mode: "DASHBOARD",
      selectedExamId: "exam-1",
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventList({ store });

  const state = store.getState();
  assert(state.ui.selectedExamId === "exam-1", "enterScheduleEventList: selectedExamId zůstává beze změny");
}

// =====================================================================
// enterScheduleEventDetail
// =====================================================================

console.log("\n── enterScheduleEventDetail ──");

// nastaví mode na SCHEDULE_EVENT_DETAIL a zapíše scheduleEventId
{
  const store = createStore({
    ui: {
      mode: "SCHEDULE_EVENT_LIST",
      selectedExamId: null,
      selectedScheduleEventId: null,
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventDetail({ store, payload: { scheduleEventId: "se-42" } });

  const state = store.getState();
  assert(state.ui.mode === "SCHEDULE_EVENT_DETAIL", "enterScheduleEventDetail: mode je SCHEDULE_EVENT_DETAIL");
  assert(state.ui.selectedScheduleEventId === "se-42", "enterScheduleEventDetail: selectedScheduleEventId je se-42");
}

// přepíše předchozí selectedScheduleEventId
{
  const store = createStore({
    ui: {
      mode: "SCHEDULE_EVENT_DETAIL",
      selectedExamId: null,
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventDetail({ store, payload: { scheduleEventId: "se-99" } });

  const state = store.getState();
  assert(state.ui.selectedScheduleEventId === "se-99", "enterScheduleEventDetail: selectedScheduleEventId je přepsán na se-99");
}

// =====================================================================
// enterScheduleEventAdministration
// =====================================================================

console.log("\n── enterScheduleEventAdministration ──");

// nastaví mode na SCHEDULE_EVENT_ADMINISTRATION a zapíše scheduleEventId
{
  const store = createStore({
    ui: {
      mode: "SCHEDULE_EVENT_LIST",
      selectedExamId: null,
      selectedScheduleEventId: null,
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventAdministration({ store, payload: { scheduleEventId: "se-42" } });

  const state = store.getState();
  assert(state.ui.mode === "SCHEDULE_EVENT_ADMINISTRATION", "enterScheduleEventAdministration: mode je SCHEDULE_EVENT_ADMINISTRATION");
  assert(state.ui.selectedScheduleEventId === "se-42", "enterScheduleEventAdministration: selectedScheduleEventId je se-42");
}

// přepíše předchozí selectedScheduleEventId
{
  const store = createStore({
    ui: {
      mode: "SCHEDULE_EVENT_ADMINISTRATION",
      selectedExamId: null,
      selectedScheduleEventId: "se-1",
      status: "READY",
      notification: null,
    },
  });

  enterScheduleEventAdministration({ store, payload: { scheduleEventId: "se-99" } });

  const state = store.getState();
  assert(state.ui.selectedScheduleEventId === "se-99", "enterScheduleEventAdministration: selectedScheduleEventId je přepsán na se-99");
}

console.log("\n── Hotovo ──\n");
