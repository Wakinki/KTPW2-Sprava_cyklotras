// tests/api/scheduleEvents.crud.test.mjs
//
// Spuštění: node tests/api/scheduleEvents.crud.test.mjs
//
// Testy CRUD operací API: getScheduleEvents, createScheduleEvent,
// deleteScheduleEvent, updateScheduleEventDetails.

import { assert } from "../assert.js";
import { createScheduleEventsApi } from "../../src/api/scheduleEventsApi.js";

// =====================================================================
// getScheduleEvents
// =====================================================================

console.log("\n── getScheduleEvents ──");

// vrátí všechny rozvrhové akce i enrollments
{
  const db = {
    users: [],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
      { id: "se-2", name: "TNPW2, 2026-04-07", time: "2027-04-07T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "OPEN" },
    ],
    enrollments: [
      { id: "enr-1", scheduleEventId: "se-1", studentId: "student-1", status: "ENROLLED" },
    ],
  };
  const result = await createScheduleEventsApi(db).getScheduleEvents();
  assert(result.status === "SUCCESS", "getScheduleEvents – vrátí SUCCESS");
  assert(result.scheduleEvents.length === 2, "getScheduleEvents – vrátí 2 rozvrhové akce");
  assert(result.enrollments.length === 1, "getScheduleEvents – vrátí 1 enrollment");
}

// prázdná databáze
{
  const db = {
    users: [],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).getScheduleEvents();
  assert(result.status === "SUCCESS", "getScheduleEvents – prázdná db → SUCCESS");
  assert(result.scheduleEvents.length === 0, "getScheduleEvents – vrátí prázdné pole scheduleEvents");
  assert(result.enrollments.length === 0, "getScheduleEvents – vrátí prázdné pole enrollments");
}

// =====================================================================
// createScheduleEvent
// =====================================================================

console.log("\n── createScheduleEvent ──");

// úspěšné vytvoření
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 5, maximalCapacity: 20 },
    "scheduler-1_99887766",
  );
  assert(result.status === "SUCCESS", "createScheduleEvent – úspěšné vytvoření");
  assert(result.scheduleEvent.status === "DRAFT", "createScheduleEvent – nová akce má stav DRAFT");
  assert(result.scheduleEvent.enrolledCount === 0, "createScheduleEvent – enrolledCount začíná od 0");
  assert(result.scheduleEvent.capacity === 5, "createScheduleEvent – capacity je 5");
  assert(result.scheduleEvent.maximalCapacity === 20, "createScheduleEvent – maximalCapacity je 20");
  assert(typeof result.scheduleEvent.id === "string", "createScheduleEvent – id je string");
}

// chybějící token
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 20 },
    null,
  );
  assert(result.status === "REJECTED", "createScheduleEvent – chybějící token → REJECTED");
}

// neplatný token
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 20 },
    "spatny-token",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – neplatný token → REJECTED");
}

// nesprávná role
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 20 },
    "teacher-1_25893255",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – nesprávná role (TEACHER) → REJECTED");
}

// čas v minulosti
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2026-01-01", time: new Date(Date.now() - 86400000).toISOString(), capacity: 0, maximalCapacity: 20 },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – čas v minulosti → REJECTED");
}

// maximalCapacity <= 0
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 0 },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – maximalCapacity <= 0 → REJECTED");
}

// maximalCapacity > 500
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 501 },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – maximalCapacity > 500 → REJECTED");
}

// maximalCapacity přesně 500 – hraniční případ
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 0, maximalCapacity: 500 },
    "scheduler-1_99887766",
  );
  assert(result.status === "SUCCESS", "createScheduleEvent – maximalCapacity === 500 → SUCCESS");
}

// capacity < 0
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: -1, maximalCapacity: 20 },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – capacity < 0 → REJECTED");
}

// capacity > maximalCapacity
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05", time: new Date(Date.now() + 86400000).toISOString(), capacity: 30, maximalCapacity: 20 },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – capacity > maximalCapacity → REJECTED");
}

// chybějící povinná data
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).createScheduleEvent(
    { name: "TNPW2, 2027-05-05" },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "createScheduleEvent – chybějící povinná data → REJECTED");
}

// =====================================================================
// deleteScheduleEvent
// =====================================================================

console.log("\n── deleteScheduleEvent ──");

// úspěšné smazání akce bez zápisů
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent(
    "se-1",
    "scheduler-1_99887766",
  );
  assert(result.status === "SUCCESS", "deleteScheduleEvent – úspěšné smazání bez zápisů");
  assert(result.scheduleEventId === "se-1", "deleteScheduleEvent – vrátí scheduleEventId");
  assert(db.scheduleEvents.length === 0, "deleteScheduleEvent – akce je odstraněna z db");
}

// úspěšné smazání akce se zápisy CANCELED a WAITING
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "CLOSED" },
    ],
    enrollments: [
      { id: "enr-1", scheduleEventId: "se-1", studentId: "student-1", status: "CANCELED" },
      { id: "enr-2", scheduleEventId: "se-1", studentId: "student-2", status: "WAITING" },
    ],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent(
    "se-1",
    "scheduler-1_99887766",
  );
  assert(result.status === "SUCCESS", "deleteScheduleEvent – smazání se CANCELED a WAITING zápisy → SUCCESS");
}

// chybějící token
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", null);
  assert(result.status === "REJECTED", "deleteScheduleEvent – chybějící token → REJECTED");
}

// neplatný token
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", "spatny-token");
  assert(result.status === "REJECTED", "deleteScheduleEvent – neplatný token → REJECTED");
}

// nesprávná role
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", "teacher-1_25893255");
  assert(result.status === "REJECTED", "deleteScheduleEvent – nesprávná role (TEACHER) → REJECTED");
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", "scheduler-1_99887766");
  assert(result.status === "REJECTED", "deleteScheduleEvent – rozvrhová akce neexistuje → REJECTED");
}

// akce je ve stavu CANCELED
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "CANCELED" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", "scheduler-1_99887766");
  assert(result.status === "REJECTED", "deleteScheduleEvent – akce je CANCELED → REJECTED");
}

// akce obsahuje zápisy ve stavu ENROLLED
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2, 2026-03-10", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 1, status: "OPEN" },
    ],
    enrollments: [
      { id: "enr-1", scheduleEventId: "se-1", studentId: "student-1", status: "ENROLLED" },
    ],
  };
  const result = await createScheduleEventsApi(db).deleteScheduleEvent("se-1", "scheduler-1_99887766");
  assert(result.status === "REJECTED", "deleteScheduleEvent – akce obsahuje ENROLLED zápisy → REJECTED");
}

// =====================================================================
// updateScheduleEventDetails
// =====================================================================

console.log("\n── updateScheduleEventDetails ──");

// úspěšná změna názvu
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "Starý název", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    "teacher-1_25893255",
  );
  assert(result.status === "SUCCESS", "updateScheduleEventDetails – úspěšná změna názvu");
  assert(result.scheduleEvent.name === "Nový název", "updateScheduleEventDetails – name je aktualizován");
}

// úspěšná změna času do budoucnosti
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const newTime = new Date(Date.now() + 86400000).toISOString();
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { time: newTime },
    "teacher-1_25893255",
  );
  assert(result.status === "SUCCESS", "updateScheduleEventDetails – úspěšná změna času");
  assert(result.scheduleEvent.time === newTime, "updateScheduleEventDetails – time je aktualizován");
}

// úspěšná změna názvu i času najednou
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "Starý název", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "OPEN" },
    ],
    enrollments: [],
  };
  const newTime = new Date(Date.now() + 86400000).toISOString();
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název", time: newTime },
    "teacher-1_25893255",
  );
  assert(result.status === "SUCCESS", "updateScheduleEventDetails – změna názvu i času → SUCCESS");
  assert(result.scheduleEvent.name === "Nový název", "updateScheduleEventDetails – name je aktualizován");
  assert(result.scheduleEvent.time === newTime, "updateScheduleEventDetails – time je aktualizován");
}

// chybějící token
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    null,
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – chybějící token → REJECTED");
}

// neplatný token
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    "spatny-token",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – neplatný token → REJECTED");
}

// nesprávná role
{
  const db = {
    users: [
      { userId: "scheduler-1", name: "Jana Plánová", role: "SCHEDULER", token: "scheduler-1_99887766" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    "scheduler-1_99887766",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – nesprávná role (SCHEDULER) → REJECTED");
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    "teacher-1_25893255",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – rozvrhová akce neexistuje → REJECTED");
}

// akce je ve stavu CANCELED
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "CANCELED" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "Nový název" },
    "teacher-1_25893255",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – akce je CANCELED → REJECTED");
}

// čas v minulosti
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { time: new Date(Date.now() - 86400000).toISOString() },
    "teacher-1_25893255",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – čas v minulosti → REJECTED");
}

// prázdný název
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_25893255" },
    ],
    scheduleEvents: [
      { id: "se-1", name: "TNPW2", time: "2027-03-10T10:00:00", capacity: 10, maximalCapacity: 20, enrolledCount: 0, status: "DRAFT" },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventDetails(
    "se-1",
    { name: "   " },
    "teacher-1_25893255",
  );
  assert(result.status === "REJECTED", "updateScheduleEventDetails – prázdný název → REJECTED");
}

console.log("\n── Hotovo ──\n");
