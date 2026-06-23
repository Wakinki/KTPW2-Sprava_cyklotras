// tests/api/scheduleEvents.transitions.test.mjs
//
// Spuštění: node tests/api/scheduleEvents.transitions.test.mjs
//
// Testy přechodových funkcí API: openScheduleEvent, cancelScheduleEvent,
// closeScheduleEventByTime, updateScheduleEventCapacity,
// updateScheduleEventMaximalCapacity, cancelEnrollment, enroll.

import { assert } from '../assert.js';
import { createScheduleEventsApi } from '../../src/api/scheduleEventsApi.js';

// =====================================================================
// openScheduleEvent
// =====================================================================

console.log('\n── openScheduleEvent ──');

// úspěšný přechod DRAFT → OPEN
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'DRAFT',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'SUCCESS', 'openScheduleEvent – úspěšný přechod DRAFT → OPEN');
  assert(result.scheduleEvent.status === 'OPEN', 'openScheduleEvent – scheduleEvent má stav OPEN');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'DRAFT',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', null);
  assert(result.status === 'REJECTED', 'openScheduleEvent – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'DRAFT',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', 'spatny-token');
  assert(result.status === 'REJECTED', 'openScheduleEvent – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'DRAFT',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'openScheduleEvent – nesprávná role (STUDENT) → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'REJECTED', 'openScheduleEvent – rozvrhová akce neexistuje → REJECTED');
}

// akce není ve stavu DRAFT
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).openScheduleEvent('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'REJECTED', 'openScheduleEvent – akce není ve stavu DRAFT → REJECTED');
}

// =====================================================================
// cancelScheduleEvent
// =====================================================================

console.log('\n── cancelScheduleEvent ──');

// úspěšný přechod OPEN → CANCELED
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'scheduler-1_99887766');
  assert(result.status === 'SUCCESS', 'cancelScheduleEvent – úspěšný přechod OPEN → CANCELED');
  assert(result.scheduleEvent.status === 'CANCELED', 'cancelScheduleEvent – scheduleEvent má stav CANCELED');
}

// úspěšný přechod CLOSED → CANCELED
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'CLOSED',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'scheduler-1_99887766');
  assert(result.status === 'SUCCESS', 'cancelScheduleEvent – úspěšný přechod CLOSED → CANCELED');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', null);
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'spatny-token');
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – nesprávná role (TEACHER) → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'scheduler-1_99887766');
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – rozvrhová akce neexistuje → REJECTED');
}

// akce je již ve stavu CANCELED
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'CANCELED',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'scheduler-1_99887766');
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – akce je již CANCELED → REJECTED');
}

// akce obsahuje zápisy ve stavu ENROLLED
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelScheduleEvent('scheduleEvent1', 'scheduler-1_99887766');
  assert(result.status === 'REJECTED', 'cancelScheduleEvent – akce obsahuje ENROLLED zápisy → REJECTED');
}

// =====================================================================
// closeScheduleEventByTime
// =====================================================================

console.log('\n── closeScheduleEventByTime ──');

// úspěšný přechod – čas akce již nastal
{
  const db = {
    users: [],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: new Date(Date.now() - 60000).toISOString(),
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).closeScheduleEventByTime('scheduleEvent1');
  assert(result.status === 'SUCCESS', 'closeScheduleEventByTime – čas nastal → SUCCESS');
  assert(result.scheduleEvent.status === 'CLOSED', 'closeScheduleEventByTime – scheduleEvent má stav CLOSED');
}

// čas akce ještě nenastal
{
  const db = {
    users: [],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: new Date(Date.now() + 60000).toISOString(),
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).closeScheduleEventByTime('scheduleEvent1');
  assert(result.status === 'REJECTED', 'closeScheduleEventByTime – čas ještě nenastal → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = { users: [], scheduleEvents: [], enrollments: [] };
  const result = await createScheduleEventsApi(db).closeScheduleEventByTime('scheduleEvent1');
  assert(result.status === 'REJECTED', 'closeScheduleEventByTime – rozvrhová akce neexistuje → REJECTED');
}

// akce není ve stavu OPEN
{
  const db = {
    users: [],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: new Date(Date.now() - 60000).toISOString(),
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'DRAFT',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).closeScheduleEventByTime('scheduleEvent1');
  assert(result.status === 'REJECTED', 'closeScheduleEventByTime – akce není ve stavu OPEN → REJECTED');
}

// =====================================================================
// updateScheduleEventCapacity
// =====================================================================

console.log('\n── updateScheduleEventCapacity ──');

// úspěšná změna capacity
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    15,
    'scheduler-1_99887766',
  );
  assert(result.status === 'SUCCESS', 'updateScheduleEventCapacity – úspěšná změna');
  assert(result.scheduleEvent.capacity === 15, 'updateScheduleEventCapacity – capacity je 15');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity('scheduleEvent1', 15, null);
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity('scheduleEvent1', 15, 'spatny-token');
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    15,
    'teacher-1_25893255',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – nesprávná role (TEACHER) → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    15,
    'scheduler-1_99887766',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – rozvrhová akce neexistuje → REJECTED');
}

// akce je ve stavu CANCELED
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'CANCELED',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    15,
    'scheduler-1_99887766',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – akce je CANCELED → REJECTED');
}

// capacity < enrolledCount
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 5,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    3,
    'scheduler-1_99887766',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – capacity < enrolledCount → REJECTED');
}

// capacity > maximalCapacity
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    25,
    'scheduler-1_99887766',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventCapacity – capacity > maximalCapacity → REJECTED');
}

// capacity přesně rovna enrolledCount – hraniční případ
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 5,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventCapacity(
    'scheduleEvent1',
    5,
    'scheduler-1_99887766',
  );
  assert(result.status === 'SUCCESS', 'updateScheduleEventCapacity – capacity === enrolledCount → SUCCESS');
}

// =====================================================================
// updateScheduleEventMaximalCapacity
// =====================================================================

console.log('\n── updateScheduleEventMaximalCapacity ──');

// úspěšná změna maximalCapacity
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    30,
    'teacher-1_25893255',
  );
  assert(result.status === 'SUCCESS', 'updateScheduleEventMaximalCapacity – úspěšná změna');
  assert(result.scheduleEvent.maximalCapacity === 30, 'updateScheduleEventMaximalCapacity – maximalCapacity je 30');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity('scheduleEvent1', 30, null);
  assert(result.status === 'REJECTED', 'updateScheduleEventMaximalCapacity – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    30,
    'spatny-token',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventMaximalCapacity – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'scheduler-1', name: 'Jana Plánová', role: 'SCHEDULER', token: 'scheduler-1_99887766' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    30,
    'scheduler-1_99887766',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventMaximalCapacity – nesprávná role (SCHEDULER) → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    30,
    'teacher-1_25893255',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventMaximalCapacity – rozvrhová akce neexistuje → REJECTED');
}

// maximalCapacity < capacity
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    5,
    'teacher-1_25893255',
  );
  assert(result.status === 'REJECTED', 'updateScheduleEventMaximalCapacity – maximalCapacity < capacity → REJECTED');
}

// maximalCapacity přesně rovna capacity – hraniční případ
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).updateScheduleEventMaximalCapacity(
    'scheduleEvent1',
    10,
    'teacher-1_25893255',
  );
  assert(result.status === 'SUCCESS', 'updateScheduleEventMaximalCapacity – maximalCapacity === capacity → SUCCESS');
}

// =====================================================================
// cancelEnrollment
// =====================================================================

console.log('\n── cancelEnrollment ──');

// úspěšné zrušení ENROLLED záznamu – enrolledCount se sníží
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'SUCCESS', 'cancelEnrollment – úspěšné zrušení ENROLLED záznamu');
  assert(result.enrollment.status === 'CANCELED', 'cancelEnrollment – enrollment má stav CANCELED');
  assert(result.scheduleEvent.enrolledCount === 0, 'cancelEnrollment – enrolledCount se snížil o 1');
}

// úspěšné zrušení WAITING záznamu – enrolledCount se nezmění
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 10,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'WAITING' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'SUCCESS', 'cancelEnrollment – úspěšné zrušení WAITING záznamu');
  assert(result.enrollment.status === 'CANCELED', 'cancelEnrollment – enrollment má stav CANCELED');
  assert(result.scheduleEvent.enrolledCount === 10, 'cancelEnrollment – enrolledCount se nezměnil');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', null);
  assert(result.status === 'REJECTED', 'cancelEnrollment – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'spatny-token');
  assert(result.status === 'REJECTED', 'cancelEnrollment – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'OPEN',
      },
    ],
    enrollments: [{ studentId: 'teacher-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'REJECTED', 'cancelEnrollment – nesprávná role (TEACHER) → REJECTED');
}

// enrollment neexistuje
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'cancelEnrollment – enrollment neexistuje → REJECTED');
}

// akce není ve stavu OPEN
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 1,
        status: 'CLOSED',
      },
    ],
    enrollments: [{ studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).cancelEnrollment('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'cancelEnrollment – akce není ve stavu OPEN → REJECTED');
}

// =====================================================================
// enroll
// =====================================================================

console.log('\n── enroll ──');

// SUCCESS – NONE → ENROLLED (kapacita volná)
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 3,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'SUCCESS', 'enroll – NONE → ENROLLED: SUCCESS');
  assert(result.enrollment.status === 'ENROLLED', 'enroll – NONE → ENROLLED: enrollment má stav ENROLLED');
  assert(result.scheduleEvent.enrolledCount === 4, 'enroll – NONE → ENROLLED: enrolledCount se zvýšil');
}

// SUCCESS – NONE → WAITING (kapacita plná)
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 10,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'SUCCESS', 'enroll – NONE → WAITING: SUCCESS');
  assert(result.enrollment.status === 'WAITING', 'enroll – NONE → WAITING: enrollment má stav WAITING');
  assert(result.scheduleEvent.enrolledCount === 10, 'enroll – NONE → WAITING: enrolledCount se nezměnil');
}

// SUCCESS – WAITING → ENROLLED (kapacita se uvolnila)
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 5,
        status: 'OPEN',
      },
    ],
    enrollments: [{ id: 'enr-1', studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'WAITING' }],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'SUCCESS', 'enroll – WAITING → ENROLLED: SUCCESS');
  assert(result.enrollment.status === 'ENROLLED', 'enroll – WAITING → ENROLLED: enrollment má stav ENROLLED');
  assert(result.scheduleEvent.enrolledCount === 6, 'enroll – WAITING → ENROLLED: enrolledCount se zvýšil');
}

// REJECTED – WAITING → kapacita stále plná
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 10,
        status: 'OPEN',
      },
    ],
    enrollments: [{ id: 'enr-1', studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'WAITING' }],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'enroll – WAITING → kapacita plná → REJECTED');
}

// REJECTED – student již ENROLLED
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 5,
        status: 'OPEN',
      },
    ],
    enrollments: [{ id: 'enr-1', studentId: 'student-1', scheduleEventId: 'scheduleEvent1', status: 'ENROLLED' }],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'enroll – student již ENROLLED → REJECTED');
}

// chybějící token
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', null);
  assert(result.status === 'REJECTED', 'enroll – chybějící token → REJECTED');
}

// neplatný token
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'spatny-token');
  assert(result.status === 'REJECTED', 'enroll – neplatný token → REJECTED');
}

// nesprávná role
{
  const db = {
    users: [{ userId: 'teacher-1', name: 'Petr Nový', role: 'TEACHER', token: 'teacher-1_25893255' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'OPEN',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'teacher-1_25893255');
  assert(result.status === 'REJECTED', 'enroll – nesprávná role (TEACHER) → REJECTED');
}

// rozvrhová akce neexistuje
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'enroll – rozvrhová akce neexistuje → REJECTED');
}

// akce není ve stavu OPEN
{
  const db = {
    users: [{ userId: 'student-1', name: 'Petr Novák', role: 'STUDENT', token: 'student-1_12345678' }],
    scheduleEvents: [
      {
        id: 'scheduleEvent1',
        name: 'TNPW2, 2026-01-20',
        time: '2026-01-20',
        capacity: 10,
        maximalCapacity: 20,
        enrolledCount: 0,
        status: 'CLOSED',
      },
    ],
    enrollments: [],
  };
  const result = await createScheduleEventsApi(db).enroll('scheduleEvent1', 'student-1_12345678');
  assert(result.status === 'REJECTED', 'enroll – akce není ve stavu OPEN → REJECTED');
}

console.log('\n── Hotovo ──\n');
