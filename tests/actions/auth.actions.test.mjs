// tests/actions/auth.actions.test.mjs
//
// Spuštění: node tests/actions/auth.actions.test.mjs
//
// Testy autentizačních akcí: loginUser, registerUser, logoutUser.
// Testujeme logiku akce – jak zapíše výsledek do stavu aplikace.
// Logiku API jsme testovali v tests/api/auth.test.mjs.

import { assert } from "../assert.js";
import { createStore } from "../../src/infra/store/createStore.js";

import { loginUser } from "../../src/app/actions/loginUser.js";
import { registerUser } from "../../src/app/actions/registerUser.js";
import { logoutUser } from "../../src/app/actions/logoutUser.js";

// =====================================================================
// loginUser
// =====================================================================

console.log("\n── loginUser ──");

// SUCCESS – auth je aktualizován ve stavu
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      login: async () => ({
        status: "SUCCESS",
        role: "TEACHER",
        userId: "teacher-1",
        token: "teacher-1_abc123",
      }),
    },
  };

  await loginUser({ store, api, payload: { username: "novak", password: "heslo123" } });

  const state = store.getState();
  assert(state.auth.role === "TEACHER", "loginUser SUCCESS: role je TEACHER");
  assert(state.auth.userId === "teacher-1", "loginUser SUCCESS: userId je teacher-1");
  assert(state.auth.token === "teacher-1_abc123", "loginUser SUCCESS: token je uložen");
  assert(state.ui.status === "READY", "loginUser SUCCESS: ui.status je READY");
  assert(state.ui.notification !== null, "loginUser SUCCESS: notification je nastavena");
  assert(state.ui.notification.type === "SUCCESS", "loginUser SUCCESS: notification.type je SUCCESS");
}

// REJECTED – auth zůstává nezměněn
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      login: async () => ({
        status: "REJECTED",
        reason: "Neplatné přihlašovací údaje",
      }),
    },
  };

  await loginUser({ store, api, payload: { username: "novak", password: "spatne" } });

  const state = store.getState();
  assert(state.auth.role === "ANONYMOUS", "loginUser REJECTED: role zůstává ANONYMOUS");
  assert(state.auth.token === null, "loginUser REJECTED: token zůstává null");
  assert(state.ui.status === "READY", "loginUser REJECTED: ui.status je READY");
  assert(state.ui.notification !== null, "loginUser REJECTED: notification je nastavena");
  assert(state.ui.notification.type === "WARNING", "loginUser REJECTED: notification.type je WARNING");
}

// ERROR – technická chyba
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      login: async () => { throw new Error("Síť nedostupná"); },
    },
  };

  await loginUser({ store, api, payload: { username: "novak", password: "heslo123" } });

  const state = store.getState();
  assert(state.ui.status === "ERROR", "loginUser ERROR: ui.status je ERROR");
  assert(state.auth.role === "ANONYMOUS", "loginUser ERROR: auth zůstává nezměněn");
}

// =====================================================================
// registerUser
// =====================================================================

console.log("\n── registerUser ──");

// SUCCESS – notifikace je nastavena
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      register: async () => ({
        status: "SUCCESS",
      }),
    },
  };

  await registerUser({ store, api, payload: { username: "novak", password: "heslo123", role: "STUDENT" } });

  const state = store.getState();
  assert(state.ui.status === "READY", "registerUser SUCCESS: ui.status je READY");
  assert(state.ui.notification !== null, "registerUser SUCCESS: notification je nastavena");
  assert(state.ui.notification.type === "SUCCESS", "registerUser SUCCESS: notification.type je SUCCESS");
}

// SUCCESS – auth zůstává ANONYMOUS (registrace nevytváří session)
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      register: async () => ({
        status: "SUCCESS",
      }),
    },
  };

  await registerUser({ store, api, payload: { username: "novak", password: "heslo123", role: "STUDENT" } });

  const state = store.getState();
  assert(state.auth.role === "ANONYMOUS", "registerUser SUCCESS: auth zůstává ANONYMOUS");
  assert(state.auth.token === null, "registerUser SUCCESS: token zůstává null");
}

// REJECTED – notifikace je nastavena, auth nezměněn
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      register: async () => ({
        status: "REJECTED",
        reason: "Uživatel již existuje",
      }),
    },
  };

  await registerUser({ store, api, payload: { username: "novak", password: "heslo123", role: "STUDENT" } });

  const state = store.getState();
  assert(state.ui.notification !== null, "registerUser REJECTED: notification je nastavena");
  assert(state.ui.notification.type === "WARNING", "registerUser REJECTED: notification.type je WARNING");
  assert(state.auth.role === "ANONYMOUS", "registerUser REJECTED: auth zůstává nezměněn");
}

// ERROR – technická chyba
{
  const store = createStore({
    auth: { role: "ANONYMOUS", userId: null, token: null },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      register: async () => { throw new Error("Síť nedostupná"); },
    },
  };

  await registerUser({ store, api, payload: { username: "novak", password: "heslo123", role: "STUDENT" } });

  const state = store.getState();
  assert(state.ui.status === "ERROR", "registerUser ERROR: ui.status je ERROR");
}

// =====================================================================
// logoutUser
// =====================================================================

console.log("\n── logoutUser ──");

// SUCCESS – auth je resetován na ANONYMOUS
{
  const store = createStore({
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc123" },
    ui: { status: "READY", notification: null, mode: "EXAM_TERM_LIST" },
  });

  const api = {
    auth: {
      logout: async () => ({ status: "SUCCESS" }),
    },
  };

  await logoutUser({ store, api });

  const state = store.getState();
  assert(state.auth.role === "ANONYMOUS", "logoutUser SUCCESS: role je ANONYMOUS");
  assert(state.auth.userId === null, "logoutUser SUCCESS: userId je null");
  assert(state.auth.token === null, "logoutUser SUCCESS: token je null");
  assert(state.ui.mode === "AUTHENTICATION", "logoutUser SUCCESS: mode je AUTHENTICATION");
}

// ERROR – technická chyba
{
  const store = createStore({
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc123" },
    ui: { status: "READY", notification: null },
  });

  const api = {
    auth: {
      logout: async () => { throw new Error("Síť nedostupná"); },
    },
  };

  await logoutUser({ store, api });

  const state = store.getState();
  assert(state.ui.status === "ERROR", "logoutUser ERROR: ui.status je ERROR");
  assert(state.auth.role === "TEACHER", "logoutUser ERROR: auth zůstává nezměněn");
}

console.log("\n── Hotovo ──\n");
