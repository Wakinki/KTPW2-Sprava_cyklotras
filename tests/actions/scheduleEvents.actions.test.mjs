// tests/actions/scheduleEvents.actions.test.mjs
//
// Spuštění: node tests/actions/scheduleEvents.actions.test.mjs
//
// Každý test má vlastní inline stav a stub.
// Testujeme logiku akce – jak zapíše výsledek do stavu aplikace.
// Logiku API jsme testovali v cvičení 5.

import { assert } from "../assert.js";
import { createStore } from "../../src/infra/store/createStore.js";

import { openScheduleEvent } from "../../src/app/actions/openScheduleEvent.js";
import { cancelScheduleEvent } from "../../src/app/actions/cancelScheduleEvent.js";
import { closeScheduleEventByTime } from "../../src/app/actions/closeScheduleEventByTime.js";
import { updateScheduleEventCapacity } from "../../src/app/actions/updateScheduleEventCapacity.js";
import { updateScheduleEventMaximalCapacity } from "../../src/app/actions/updateScheduleEventMaximalCapacity.js";
import { cancelEnrollment } from "../../src/app/actions/cancelEnrollment.js";
import { enroll } from "../../src/app/actions/enroll.js";
import { createScheduleEvent } from "../../src/app/actions/createScheduleEvent.js";
import { deleteScheduleEvent } from "../../src/app/actions/deleteScheduleEvent.js";
import { updateScheduleEventDetails } from "../../src/app/actions/updateScheduleEventDetails.js";

// --------------------------------------------------
// openScheduleEvent
// --------------------------------------------------

console.log("\n── openScheduleEvent ──");

// SUCCESS – scheduleEvent je aktualizován v poli
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "DRAFT" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      openScheduleEvent: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN" },
      }),
    },
  };

  await openScheduleEvent({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "openScheduleEvent SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "openScheduleEvent SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "openScheduleEvent SUCCESS: notification je typu SUCCESS",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "OPEN",
    "openScheduleEvent SUCCESS: scheduleEvent má status OPEN",
  );
}

// REJECTED – stav se nemění, notification je nastavena
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "DRAFT" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      openScheduleEvent: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await openScheduleEvent({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "openScheduleEvent REJECTED: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "openScheduleEvent REJECTED: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "WARNING",
    "openScheduleEvent REJECTED: notification je typu WARNING",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "DRAFT",
    "openScheduleEvent REJECTED: scheduleEvent zůstává DRAFT",
  );
}

// ERROR – technická chyba
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      openScheduleEvent: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await openScheduleEvent({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "openScheduleEvent ERROR: ui.status je ERROR",
  );
  assert(
    state.ui.message !== null,
    "openScheduleEvent ERROR: ui.message je nastaven",
  );
}

// --------------------------------------------------
// cancelScheduleEvent
// --------------------------------------------------

console.log("\n── cancelScheduleEvent ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelScheduleEvent: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "CANCELED" },
      }),
    },
  };

  await cancelScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "cancelScheduleEvent SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "cancelScheduleEvent SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "cancelScheduleEvent SUCCESS: notification je typu SUCCESS",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "CANCELED",
    "cancelScheduleEvent SUCCESS: scheduleEvent má status CANCELED",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelScheduleEvent: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await cancelScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "cancelScheduleEvent REJECTED: notification je nastavena",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "OPEN",
    "cancelScheduleEvent REJECTED: scheduleEvent zůstává OPEN",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelScheduleEvent: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await cancelScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "cancelScheduleEvent ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// closeScheduleEventByTime
// --------------------------------------------------

console.log("\n── closeScheduleEventByTime ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      closeScheduleEventByTime: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "CLOSED" },
      }),
    },
  };

  await closeScheduleEventByTime({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "closeScheduleEventByTime SUCCESS: ui.status je READY",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "CLOSED",
    "closeScheduleEventByTime SUCCESS: scheduleEvent má status CLOSED",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      closeScheduleEventByTime: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await closeScheduleEventByTime({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "closeScheduleEventByTime REJECTED: notification je nastavena",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.status === "OPEN",
    "closeScheduleEventByTime REJECTED: scheduleEvent zůstává OPEN",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      closeScheduleEventByTime: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await closeScheduleEventByTime({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "closeScheduleEventByTime ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// updateScheduleEventCapacity
// --------------------------------------------------

console.log("\n── updateScheduleEventCapacity ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "scheduler-1_99887766" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", capacity: 10 }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventCapacity: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN", capacity: 15 },
      }),
    },
  };

  await updateScheduleEventCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", capacity: 15 },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "updateScheduleEventCapacity SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "updateScheduleEventCapacity SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "updateScheduleEventCapacity SUCCESS: notification je typu SUCCESS",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.capacity === 15,
    "updateScheduleEventCapacity SUCCESS: capacity je aktualizována na 15",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "scheduler-1_99887766" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", capacity: 10 }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventCapacity: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await updateScheduleEventCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", capacity: 15 },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "updateScheduleEventCapacity REJECTED: notification je nastavena",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.capacity === 10,
    "updateScheduleEventCapacity REJECTED: capacity zůstává 10",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "scheduler-1_99887766" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventCapacity: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await updateScheduleEventCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", capacity: 15 },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "updateScheduleEventCapacity ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// updateScheduleEventMaximalCapacity
// --------------------------------------------------

console.log("\n── updateScheduleEventMaximalCapacity ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", maximalCapacity: 20 }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventMaximalCapacity: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN", maximalCapacity: 30 },
      }),
    },
  };

  await updateScheduleEventMaximalCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", maximalCapacity: 30 },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "updateScheduleEventMaximalCapacity SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "updateScheduleEventMaximalCapacity SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "updateScheduleEventMaximalCapacity SUCCESS: notification je typu SUCCESS",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.maximalCapacity === 30,
    "updateScheduleEventMaximalCapacity SUCCESS: maximalCapacity je aktualizována na 30",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", maximalCapacity: 20 }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventMaximalCapacity: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await updateScheduleEventMaximalCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", maximalCapacity: 30 },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "updateScheduleEventMaximalCapacity REJECTED: notification je nastavena",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.maximalCapacity === 20,
    "updateScheduleEventMaximalCapacity REJECTED: maximalCapacity zůstává 20",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventMaximalCapacity: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await updateScheduleEventMaximalCapacity({
    store,
    api,
    payload: { scheduleEventId: "se-1", maximalCapacity: 30 },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "updateScheduleEventMaximalCapacity ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// cancelEnrollment
// --------------------------------------------------

console.log("\n── cancelEnrollment ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", enrolledCount: 1 }],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "ENROLLED",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelEnrollment: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN", enrolledCount: 0 },
        enrollment: {
          id: "enr-1",
          scheduleEventId: "se-1",
          studentId: "student-1",
          status: "CANCELED",
        },
      }),
    },
  };

  await cancelEnrollment({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "cancelEnrollment SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "cancelEnrollment SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "cancelEnrollment SUCCESS: notification je typu SUCCESS",
  );
  const enr = state.enrollments.find((e) => e.id === "enr-1");
  assert(
    enr.status === "CANCELED",
    "cancelEnrollment SUCCESS: enrollment má status CANCELED",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.enrolledCount === 0,
    "cancelEnrollment SUCCESS: enrolledCount je aktualizován",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", enrolledCount: 1 }],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "ENROLLED",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelEnrollment: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
        enrollment: null,
      }),
    },
  };

  await cancelEnrollment({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "cancelEnrollment REJECTED: notification je nastavena",
  );
  const enr = state.enrollments.find((e) => e.id === "enr-1");
  assert(
    enr.status === "ENROLLED",
    "cancelEnrollment REJECTED: enrollment zůstává ENROLLED",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [],
    enrollments: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      cancelEnrollment: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await cancelEnrollment({ store, api, payload: { scheduleEventId: "se-1" } });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "cancelEnrollment ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// enroll
// --------------------------------------------------

console.log("\n── enroll ──");

// SUCCESS – nový enrollment
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", enrolledCount: 0 }],
    enrollments: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN", enrolledCount: 1 },
        enrollment: {
          id: "enr-1",
          scheduleEventId: "se-1",
          studentId: "student-1",
          status: "ENROLLED",
        },
      }),
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "enroll SUCCESS nový: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "enroll SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "enroll SUCCESS: notification je typu SUCCESS",
  );
  const enr = state.enrollments.find((e) => e.id === "enr-1");
  assert(
    enr !== undefined,
    "enroll SUCCESS nový: enrollment je přidán do pole",
  );
  assert(
    enr.status === "ENROLLED",
    "enroll SUCCESS nový: enrollment má status ENROLLED",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.enrolledCount === 1,
    "enroll SUCCESS nový: enrolledCount je aktualizován",
  );
}

// SUCCESS – WAITING → ENROLLED (kapacita se uvolnila)
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [
      { id: "se-1", status: "OPEN", enrolledCount: 5, capacity: 10 },
    ],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "WAITING",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => ({
        status: "SUCCESS",
        scheduleEvent: {
          id: "se-1",
          status: "OPEN",
          enrolledCount: 6,
          capacity: 10,
        },
        enrollment: {
          id: "enr-1",
          scheduleEventId: "se-1",
          studentId: "student-1",
          status: "ENROLLED",
        },
      }),
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  const allEnr = state.enrollments.filter((e) => e.id === "enr-1");
  assert(
    allEnr.length === 1,
    "enroll WAITING→ENROLLED: enrollment není zduplikován",
  );
  assert(
    allEnr[0].status === "ENROLLED",
    "enroll WAITING→ENROLLED: enrollment má status ENROLLED",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.enrolledCount === 6,
    "enroll WAITING→ENROLLED: enrolledCount je aktualizován",
  );
}

// SUCCESS – opětovný zápis, enrollment již existuje (byl CANCELED)
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", enrolledCount: 0 }],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "CANCELED",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => ({
        status: "SUCCESS",
        scheduleEvent: { id: "se-1", status: "OPEN", enrolledCount: 1 },
        enrollment: {
          id: "enr-1",
          scheduleEventId: "se-1",
          studentId: "student-1",
          status: "ENROLLED",
        },
      }),
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  const allEnr = state.enrollments.filter((e) => e.id === "enr-1");
  assert(
    allEnr.length === 1,
    "enroll SUCCESS opětovný: enrollment není zduplikován",
  );
  assert(
    allEnr[0].status === "ENROLLED",
    "enroll SUCCESS opětovný: enrollment je aktualizován na ENROLLED",
  );
}

// SUCCESS – zápis na čekací listinu
{
  const store = createStore({
    auth: { token: "student-2_11111111" },
    scheduleEvents: [
      { id: "se-1", status: "OPEN", enrolledCount: 10, capacity: 10 },
    ],
    enrollments: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => ({
        status: "SUCCESS",
        scheduleEvent: {
          id: "se-1",
          status: "OPEN",
          enrolledCount: 10,
          capacity: 10,
        },
        enrollment: {
          id: "enr-2",
          scheduleEventId: "se-1",
          studentId: "student-2",
          status: "WAITING",
        },
      }),
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  const enr = state.enrollments.find((e) => e.id === "enr-2");
  assert(
    enr !== undefined,
    "enroll SUCCESS waiting: enrollment je přidán do pole",
  );
  assert(
    enr.status === "WAITING",
    "enroll SUCCESS waiting: enrollment má status WAITING",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [{ id: "se-1", status: "OPEN", enrolledCount: 0 }],
    enrollments: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
        enrollment: null,
      }),
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "enroll REJECTED: notification je nastavena",
  );
  assert(
    state.enrollments.length === 0,
    "enroll REJECTED: enrollments se nezměnily",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "student-1_12345678" },
    scheduleEvents: [],
    enrollments: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      enroll: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await enroll({ store, api, payload: { scheduleEventId: "se-1" } });
  const state = store.getState();
  assert(state.ui.status === "ERROR", "enroll ERROR: ui.status je ERROR");
}

// --------------------------------------------------
// createScheduleEvent
// --------------------------------------------------

console.log("\n── createScheduleEvent ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      createScheduleEvent: async () => ({
        status: "SUCCESS",
        scheduleEvent: {
          id: "se-new",
          name: "TNPW2, 2026-05-05",
          status: "DRAFT",
          capacity: 10,
          maximalCapacity: 20,
          enrolledCount: 0,
          time: "2027-05-05T10:00:00",
        },
      }),
    },
  };

  await createScheduleEvent({
    store,
    api,
    payload: {
      name: "TNPW2, 2026-05-05",
      time: "2027-05-05T10:00:00",
      capacity: 10,
      maximalCapacity: 20,
    },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "createScheduleEvent SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "createScheduleEvent SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "createScheduleEvent SUCCESS: notification je typu SUCCESS",
  );
  assert(
    state.scheduleEvents.length === 1,
    "createScheduleEvent SUCCESS: scheduleEvent je přidán do pole",
  );
  assert(
    state.scheduleEvents[0].id === "se-new",
    "createScheduleEvent SUCCESS: id nového záznamu je se-new",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      createScheduleEvent: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await createScheduleEvent({
    store,
    api,
    payload: {
      name: "TNPW2, 2026-05-05",
      time: "2027-05-05T10:00:00",
      capacity: 10,
      maximalCapacity: 20,
    },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "createScheduleEvent REJECTED: notification je nastavena",
  );
  assert(
    state.scheduleEvents.length === 0,
    "createScheduleEvent REJECTED: pole zůstává prázdné",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      createScheduleEvent: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await createScheduleEvent({
    store,
    api,
    payload: {
      name: "TNPW2, 2026-05-05",
      time: "2027-05-05T10:00:00",
      capacity: 10,
      maximalCapacity: 20,
    },
  });

  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "createScheduleEvent ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// deleteScheduleEvent
// --------------------------------------------------

console.log("\n── deleteScheduleEvent ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "DRAFT" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      deleteScheduleEvent: async () => ({
        status: "SUCCESS",
        scheduleEventId: "se-1",
      }),
    },
  };

  await deleteScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "deleteScheduleEvent SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "deleteScheduleEvent SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "deleteScheduleEvent SUCCESS: notification je typu SUCCESS",
  );
  assert(
    state.scheduleEvents.length === 0,
    "deleteScheduleEvent SUCCESS: scheduleEvent je odebrán z pole",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [{ id: "se-1", status: "DRAFT" }],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      deleteScheduleEvent: async () => ({ status: "REJECTED" }),
    },
  };

  await deleteScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "deleteScheduleEvent REJECTED: notification je nastavena",
  );
  assert(
    state.scheduleEvents.length === 1,
    "deleteScheduleEvent REJECTED: scheduleEvent zůstává v poli",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      deleteScheduleEvent: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await deleteScheduleEvent({
    store,
    api,
    payload: { scheduleEventId: "se-1" },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "deleteScheduleEvent ERROR: ui.status je ERROR",
  );
}

// --------------------------------------------------
// updateScheduleEventDetails
// --------------------------------------------------

console.log("\n── updateScheduleEventDetails ──");

// SUCCESS
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "Starý název",
        status: "DRAFT",
        time: "2027-03-10T10:00:00",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventDetails: async () => ({
        status: "SUCCESS",
        scheduleEvent: {
          id: "se-1",
          name: "Nový název",
          status: "DRAFT",
          time: "2027-03-10T10:00:00",
        },
      }),
    },
  };

  await updateScheduleEventDetails({
    store,
    api,
    payload: { scheduleEventId: "se-1", data: { name: "Nový název" } },
  });

  const state = store.getState();
  assert(
    state.ui.status === "READY",
    "updateScheduleEventDetails SUCCESS: ui.status je READY",
  );
  assert(
    state.ui.notification !== null,
    "updateScheduleEventDetails SUCCESS: notification je nastavena",
  );
  assert(
    state.ui.notification.type === "SUCCESS",
    "updateScheduleEventDetails SUCCESS: notification je typu SUCCESS",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.name === "Nový název",
    "updateScheduleEventDetails SUCCESS: name je aktualizován",
  );
}

// REJECTED
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "Starý název",
        status: "DRAFT",
        time: "2027-03-10T10:00:00",
      },
    ],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventDetails: async () => ({
        status: "REJECTED",
        scheduleEvent: null,
      }),
    },
  };

  await updateScheduleEventDetails({
    store,
    api,
    payload: { scheduleEventId: "se-1", data: { name: "Nový název" } },
  });

  const state = store.getState();
  assert(
    state.ui.notification !== null,
    "updateScheduleEventDetails REJECTED: notification je nastavena",
  );
  const se = state.scheduleEvents.find((e) => e.id === "se-1");
  assert(
    se.name === "Starý název",
    "updateScheduleEventDetails REJECTED: name zůstává nezměněn",
  );
}

// ERROR
{
  const store = createStore({
    auth: { token: "teacher-1_25893255" },
    scheduleEvents: [],
    ui: { status: "READY", notification: null },
  });

  const api = {
    scheduleEvents: {
      updateScheduleEventDetails: async () => {
        throw new Error("Síť nedostupná");
      },
    },
  };

  await updateScheduleEventDetails({
    store,
    api,
    payload: { scheduleEventId: "se-1", data: { name: "Nový název" } },
  });
  const state = store.getState();
  assert(
    state.ui.status === "ERROR",
    "updateScheduleEventDetails ERROR: ui.status je ERROR",
  );
}

console.log("\n── Hotovo ──\n");
