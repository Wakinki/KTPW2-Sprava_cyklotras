// tests/selectors/selectors.test.mjs
//
// Spuštění: node tests/selectors/selectors.test.mjs
//
// Testy selektorů: selectDashboardView, selectAuthenticationView,
// selectScheduleEventListView, selectScheduleEventDetailView,
// selectScheduleEventAdministrationView.

import { assert } from "../assert.js";
import {
  selectDashboardView,
  selectAuthenticationView,
  selectScheduleEventListView,
  selectScheduleEventDetailView,
  selectScheduleEventAdministrationView,
} from "../../src/infra/store/selectors.js";

// =====================================================================
// selectDashboardView
// =====================================================================

console.log("\n── selectDashboardView ──");

// STUDENT – vidí počty svých zápisů
{
  const state = {
    auth: { role: "STUDENT", userId: "student-1", token: "student-1_abc" },
    scheduleEvents: [],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "ENROLLED",
      },
      {
        id: "enr-2",
        scheduleEventId: "se-1",
        studentId: "student-2",
        status: "ENROLLED",
      },
      {
        id: "enr-3",
        scheduleEventId: "se-2",
        studentId: "student-1",
        status: "CANCELED",
      },
    ],
    exams: [],
    registrations: [
      { userId: "student-1", examId: "exam-1", status: "REGISTERED" },
      { userId: "student-1", examId: "exam-2", status: "UNREGISTERED" },
    ],
  };

  const viewState = selectDashboardView(state);
  assert(
    viewState.type === "DASHBOARD",
    "selectDashboardView STUDENT: type je DASHBOARD",
  );
  assert(
    viewState.role === "STUDENT",
    "selectDashboardView STUDENT: role je STUDENT",
  );
  assert(
    viewState.summary.enrollmentsCount === 1,
    "selectDashboardView STUDENT: enrollmentsCount je 1 (CANCELED se nepočítá)",
  );
  assert(
    viewState.summary.registrationsCount === 1,
    "selectDashboardView STUDENT: registrationsCount je 1",
  );
  assert(
    viewState.capabilities.canEnterExamTermList === true,
    "selectDashboardView STUDENT: canEnterExamTermList je true",
  );
  assert(
    viewState.capabilities.canEnterScheduleEventList === true,
    "selectDashboardView STUDENT: canEnterScheduleEventList je true",
  );
  assert(
    viewState.capabilities.canEnterScheduleEventAdministration === true,
    "selectDashboardView STUDENT: canEnterScheduleEventAdministration je true",
  );
}

// TEACHER – vidí přehled termínů a akcí podle stavu
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [
      { id: "se-1", status: "DRAFT" },
      { id: "se-2", status: "OPEN" },
      { id: "se-3", status: "OPEN" },
    ],
    enrollments: [],
    exams: [
      { id: "exam-1", status: "DRAFT" },
      { id: "exam-2", status: "PUBLISHED" },
    ],
    registrations: [],
  };

  const viewState = selectDashboardView(state);
  assert(
    viewState.type === "DASHBOARD",
    "selectDashboardView TEACHER: type je DASHBOARD",
  );
  assert(
    viewState.summary.draftExamsCount === 1,
    "selectDashboardView TEACHER: draftExamsCount je 1",
  );
  assert(
    viewState.summary.publishedExamsCount === 1,
    "selectDashboardView TEACHER: publishedExamsCount je 1",
  );
  assert(
    viewState.summary.draftEventsCount === 1,
    "selectDashboardView TEACHER: draftEventsCount je 1",
  );
  assert(
    viewState.summary.openEventsCount === 2,
    "selectDashboardView TEACHER: openEventsCount je 2",
  );
  assert(
    viewState.capabilities.canEnterExamTermList === true,
    "selectDashboardView TEACHER: canEnterExamTermList je true",
  );
}

// SCHEDULER – vidí přehled plných akcí a čekajících zápisů
{
  const state = {
    auth: {
      role: "SCHEDULER",
      userId: "scheduler-1",
      token: "scheduler-1_abc",
    },
    scheduleEvents: [
      { id: "se-1", status: "OPEN", capacity: 10, enrolledCount: 10 },
      { id: "se-2", status: "OPEN", capacity: 20, enrolledCount: 5 },
      { id: "se-3", status: "DRAFT", capacity: 10, enrolledCount: 0 },
    ],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "WAITING",
      },
      {
        id: "enr-2",
        scheduleEventId: "se-1",
        studentId: "student-2",
        status: "WAITING",
      },
      {
        id: "enr-3",
        scheduleEventId: "se-2",
        studentId: "student-3",
        status: "ENROLLED",
      },
    ],
    exams: [],
    registrations: [],
  };

  const viewState = selectDashboardView(state);
  assert(
    viewState.type === "DASHBOARD",
    "selectDashboardView SCHEDULER: type je DASHBOARD",
  );
  assert(
    viewState.summary.openEventsCount === 2,
    "selectDashboardView SCHEDULER: openEventsCount je 2",
  );
  assert(
    viewState.summary.fullEventsCount === 1,
    "selectDashboardView SCHEDULER: fullEventsCount je 1",
  );
  assert(
    viewState.summary.waitingEnrollmentsCount === 2,
    "selectDashboardView SCHEDULER: waitingEnrollmentsCount je 2",
  );
  assert(
    viewState.capabilities.canEnterExamTermList === true,
    "selectDashboardView SCHEDULER: canEnterExamTermList je true",
  );
}

// ANONYMOUS – vrátí base bez summary
{
  const state = {
    auth: { role: "ANONYMOUS", userId: null, token: null },
    scheduleEvents: [],
    enrollments: [],
    exams: [],
    registrations: [],
  };

  const viewState = selectDashboardView(state);
  assert(
    viewState.type === "DASHBOARD",
    "selectDashboardView ANONYMOUS: type je DASHBOARD",
  );
  assert(
    viewState.summary === undefined,
    "selectDashboardView ANONYMOUS: summary není přítomno",
  );
}

// =====================================================================
// selectAuthenticationView
// =====================================================================

console.log("\n── selectAuthenticationView ──");

// nepřihlášený uživatel
{
  const state = {
    auth: { role: "ANONYMOUS", userId: null, token: null },
  };

  const viewState = selectAuthenticationView(state);
  assert(
    viewState.type === "AUTHENTICATION",
    "selectAuthenticationView ANONYMOUS: type je AUTHENTICATION",
  );
  assert(
    viewState.isLoggedIn === false,
    "selectAuthenticationView ANONYMOUS: isLoggedIn je false",
  );
  assert(
    viewState.capabilities.canLogin === true,
    "selectAuthenticationView ANONYMOUS: canLogin je true",
  );
  assert(
    viewState.capabilities.canRegister === true,
    "selectAuthenticationView ANONYMOUS: canRegister je true",
  );
  assert(
    viewState.capabilities.canLogout === false,
    "selectAuthenticationView ANONYMOUS: canLogout je false",
  );
}

// přihlášený uživatel
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
  };

  const viewState = selectAuthenticationView(state);
  assert(
    viewState.type === "AUTHENTICATION",
    "selectAuthenticationView TEACHER: type je AUTHENTICATION",
  );
  assert(
    viewState.isLoggedIn === true,
    "selectAuthenticationView TEACHER: isLoggedIn je true",
  );
  assert(
    viewState.capabilities.canLogin === false,
    "selectAuthenticationView TEACHER: canLogin je false",
  );
  assert(
    viewState.capabilities.canRegister === false,
    "selectAuthenticationView TEACHER: canRegister je false",
  );
  assert(
    viewState.capabilities.canLogout === true,
    "selectAuthenticationView TEACHER: canLogout je true",
  );
}

// =====================================================================
// selectScheduleEventListView
// =====================================================================

console.log("\n── selectScheduleEventListView ──");

// STUDENT – vidí seznam, nemůže vytvářet ani spravovat
{
  const state = {
    auth: { role: "STUDENT", userId: "student-1", token: "student-1_abc" },
    scheduleEvents: [{ id: "se-1", name: "TNPW2", status: "OPEN" }],
    enrollments: [],
    ui: { selectedScheduleEventId: null },
  };

  const viewState = selectScheduleEventListView(state);
  assert(
    viewState.type === "SCHEDULE_EVENT_LIST",
    "selectScheduleEventListView STUDENT: type je SCHEDULE_EVENT_LIST",
  );
  assert(
    viewState.scheduleEvents.length === 1,
    "selectScheduleEventListView STUDENT: vrátí 1 akci",
  );
  assert(
    viewState.capabilities.canEnterDetail === true,
    "selectScheduleEventListView STUDENT: canEnterDetail je true",
  );
  assert(
    viewState.capabilities.canEnterAdministration === false,
    "selectScheduleEventListView STUDENT: canEnterAdministration je false",
  );
  assert(
    viewState.capabilities.canCreateScheduleEvent === false,
    "selectScheduleEventListView STUDENT: canCreateScheduleEvent je false",
  );
}

// SCHEDULER – může vytvářet a spravovat
{
  const state = {
    auth: {
      role: "SCHEDULER",
      userId: "scheduler-1",
      token: "scheduler-1_abc",
    },
    scheduleEvents: [],
    enrollments: [],
    ui: { selectedScheduleEventId: null },
  };

  const viewState = selectScheduleEventListView(state);
  assert(
    viewState.capabilities.canEnterAdministration === true,
    "selectScheduleEventListView SCHEDULER: canEnterAdministration je true",
  );
  assert(
    viewState.capabilities.canCreateScheduleEvent === true,
    "selectScheduleEventListView SCHEDULER: canCreateScheduleEvent je true",
  );
}

// TEACHER – může spravovat, nemůže vytvářet
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [],
    enrollments: [],
    ui: { selectedScheduleEventId: null },
  };

  const viewState = selectScheduleEventListView(state);
  assert(
    viewState.capabilities.canEnterAdministration === true,
    "selectScheduleEventListView TEACHER: canEnterAdministration je true",
  );
  assert(
    viewState.capabilities.canCreateScheduleEvent === false,
    "selectScheduleEventListView TEACHER: canCreateScheduleEvent je false",
  );
}

// =====================================================================
// selectScheduleEventDetailView
// =====================================================================

console.log("\n── selectScheduleEventDetailView ──");

// STUDENT bez zápisu – může se zapsat
{
  const state = {
    auth: { role: "STUDENT", userId: "student-1", token: "student-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        enrolledCount: 3,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventDetailView(state);
  assert(
    viewState.type === "SCHEDULE_EVENT_DETAIL",
    "selectScheduleEventDetailView STUDENT: type je SCHEDULE_EVENT_DETAIL",
  );
  assert(
    viewState.scheduleEvent.id === "se-1",
    "selectScheduleEventDetailView STUDENT: vrátí správnou akci",
  );
  assert(
    viewState.enrollment === null,
    "selectScheduleEventDetailView STUDENT: enrollment je null",
  );
  assert(
    viewState.capabilities.canEnroll === true,
    "selectScheduleEventDetailView STUDENT: canEnroll je true",
  );
  assert(
    viewState.capabilities.canCancelEnrollment === false,
    "selectScheduleEventDetailView STUDENT: canCancelEnrollment je false",
  );
}

// STUDENT s aktivním zápisem – může zrušit
{
  const state = {
    auth: { role: "STUDENT", userId: "student-1", token: "student-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        enrolledCount: 1,
      },
    ],
    enrollments: [
      {
        id: "enr-1",
        scheduleEventId: "se-1",
        studentId: "student-1",
        status: "ENROLLED",
      },
    ],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventDetailView(state);
  assert(
    viewState.enrollment.status === "ENROLLED",
    "selectScheduleEventDetailView STUDENT ENROLLED: enrollment je ENROLLED",
  );
  assert(
    viewState.capabilities.canEnroll === false,
    "selectScheduleEventDetailView STUDENT ENROLLED: canEnroll je false",
  );
  assert(
    viewState.capabilities.canCancelEnrollment === true,
    "selectScheduleEventDetailView STUDENT ENROLLED: canCancelEnrollment je true",
  );
}

// TEACHER – může otevřít DRAFT akci
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "DRAFT",
        capacity: 10,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventDetailView(state);
  assert(
    viewState.capabilities.canOpen === true,
    "selectScheduleEventDetailView TEACHER DRAFT: canOpen je true",
  );
  assert(
    viewState.capabilities.canCancelScheduleEvent === false,
    "selectScheduleEventDetailView TEACHER DRAFT: canCancelScheduleEvent je false",
  );
  assert(
    viewState.capabilities.canEnroll === false,
    "selectScheduleEventDetailView TEACHER: canEnroll je false",
  );
}

// TEACHER – může zrušit OPEN akci
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventDetailView(state);
  assert(
    viewState.capabilities.canOpen === false,
    "selectScheduleEventDetailView TEACHER OPEN: canOpen je false",
  );
  assert(
    viewState.capabilities.canCancelScheduleEvent === true,
    "selectScheduleEventDetailView TEACHER OPEN: canCancelScheduleEvent je true",
  );
}

// =====================================================================
// selectScheduleEventAdministrationView
// =====================================================================

console.log("\n── selectScheduleEventAdministrationView ──");

// TEACHER – může upravovat detaily a maximální kapacitu
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventAdministrationView(state);
  assert(
    viewState.type === "SCHEDULE_EVENT_ADMINISTRATION",
    "selectScheduleEventAdministrationView TEACHER: type je SCHEDULE_EVENT_ADMINISTRATION",
  );
  assert(
    viewState.capabilities.canUpdateDetails === true,
    "selectScheduleEventAdministrationView TEACHER: canUpdateDetails je true",
  );
  assert(
    viewState.capabilities.canUpdateMaximalCapacity === true,
    "selectScheduleEventAdministrationView TEACHER: canUpdateMaximalCapacity je true",
  );
  assert(
    viewState.capabilities.canUpdateCapacity === false,
    "selectScheduleEventAdministrationView TEACHER: canUpdateCapacity je false",
  );
  assert(
    viewState.capabilities.canDeleteScheduleEvent === false,
    "selectScheduleEventAdministrationView TEACHER: canDeleteScheduleEvent je false",
  );
}

// SCHEDULER – může upravovat kapacitu a mazat
{
  const state = {
    auth: {
      role: "SCHEDULER",
      userId: "scheduler-1",
      token: "scheduler-1_abc",
    },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventAdministrationView(state);
  assert(
    viewState.capabilities.canUpdateCapacity === true,
    "selectScheduleEventAdministrationView SCHEDULER: canUpdateCapacity je true",
  );
  assert(
    viewState.capabilities.canUpdateDetails === true,
    "selectScheduleEventAdministrationView SCHEDULER: canUpdateDetails je true",
  );
  assert(
    viewState.capabilities.canDeleteScheduleEvent === true,
    "selectScheduleEventAdministrationView SCHEDULER: canDeleteScheduleEvent je true",
  );
  assert(
    viewState.capabilities.canUpdateMaximalCapacity === false,
    "selectScheduleEventAdministrationView SCHEDULER: canUpdateMaximalCapacity je false",
  );
}

// STUDENT – nemá přístup
{
  const state = {
    auth: { role: "STUDENT", userId: "student-1", token: "student-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "OPEN",
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventAdministrationView(state);
  assert(
    viewState.type === "ERROR",
    "selectScheduleEventAdministrationView STUDENT: type je ERROR",
  );
}

// CANCELED akce – nelze upravovat
{
  const state = {
    auth: { role: "TEACHER", userId: "teacher-1", token: "teacher-1_abc" },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "CANCELED",
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventAdministrationView(state);
  assert(
    viewState.capabilities.canUpdateDetails === false,
    "selectScheduleEventAdministrationView CANCELED: canUpdateDetails je false",
  );
  assert(
    viewState.capabilities.canUpdateMaximalCapacity === false,
    "selectScheduleEventAdministrationView CANCELED: canUpdateMaximalCapacity je false",
  );
}

// CLOSED akce – nelze upravovat, lze smazat (bez ENROLLED)
{
  const state = {
    auth: {
      role: "SCHEDULER",
      userId: "scheduler-1",
      token: "scheduler-1_abc",
    },
    scheduleEvents: [
      {
        id: "se-1",
        name: "TNPW2",
        status: "CLOSED",
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
      },
    ],
    enrollments: [],
    ui: { selectedScheduleEventId: "se-1" },
  };

  const viewState = selectScheduleEventAdministrationView(state);
  assert(
    viewState.capabilities.canUpdateCapacity === false,
    "selectScheduleEventAdministrationView CLOSED: canUpdateCapacity je false",
  );
  assert(
    viewState.capabilities.canDeleteScheduleEvent === true,
    "selectScheduleEventAdministrationView CLOSED: canDeleteScheduleEvent je true",
  );
}

console.log("\n── Hotovo ──\n");
