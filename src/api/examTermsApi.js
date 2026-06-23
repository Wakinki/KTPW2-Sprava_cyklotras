/**
 * Mock server API for exams and registrations
 *
 * - simuluje serverovou perzistenci v paměti
 * - simuluje asynchronní chování (latence)
 * - garantuje invarianty (kapacita, existence termínu)
 *
 * Frontend neřeší, jak jsou data ukládána.
 *
 */
import { delay } from "./utils.js";
export function createExamTermsApi(db) {
  return {
    async getExams(token) {
      await delay();

      return {
        status: "SUCCESS",
        exams: structuredClone(db.exams),
        registrations: structuredClone(db.registrations),
      };
    },

    // =========================
    // API
    // =========================

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async cancelExamTerm(examId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      const exam = db.exams.find((t) => t.id === examId);

      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Termín je již zrušen",
        };
      }

      // je někdo zapsaný na termín?
      const hasRegistrations = db.registrations.some(
        (r) => r.examId === examId && r.status === "REGISTERED",
      );

      if (hasRegistrations) {
        return {
          status: "REJECTED",
          reason: "Termín obsahuje registrace",
        };
      }

      exam.status = "CANCELED";

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async createExamTerm(payload, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      // ************************

      // validace vstupu
      const { name, date, capacity } = payload ?? {};
      if (!name || !date || typeof capacity !== "number") {
        // NEW  || !capacity z podmínky vyhodíme, protože by neprošla kapacita 0
        return {
          status: "REJECTED",
          reason: "Neplatná data termínu",
        };
      }

      if (capacity < 0) {
        return {
          status: "REJECTED",
          reason: "Neplatná kapacita termínu",
        };
      }

      // vytvoření nového zkouškového termínu
      const exam = {
        id: crypto.randomUUID(),
        name,
        date,
        capacity,
        registeredCount: 0,
        status: "DRAFT",
      };

      db.exams.push(exam);

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async deleteExamTerm(examId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      // ecistuje termín?
      const exam = db.exams.find((e) => e.id === examId);
      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      // doménová pravidla
      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Termín je již zrušen",
        };
      }

      // existují aktivní registrace?
      const hasRegistrations = db.registrations.some(
        (r) => r.examId === examId && r.status === "REGISTERED",
      );

      if (hasRegistrations) {
        return {
          status: "REJECTED",
          reason: "Termín obsahuje registrace",
        };
      }

      // skutečné smazání termínu
      db.exams = db.exams.filter((e) => e.id !== examId);

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async publishExamTerm(examId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // existuje termín?
      const exam = db.exams.find((e) => e.id === examId);
      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      // doménová logika
      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Termín je již zrušen",
        };
      }

      if (exam.status === "PUBLISHED") {
        return {
          status: "REJECTED",
          reason: "Termín je již zveřejněn pro zápis",
        };
      }

      // skutečné zveřejnení termínu
      exam.status = "PUBLISHED";

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    // má vracet { status, reason} nebo { result, registration, exam }
    // status = SUCCESS | REJECTED
    async registerForExam(examId, userId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);

      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "STUDENT") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      const verifiedUserId = user.userId;

      // existuje termín?
      const exam = db.exams.find((e) => e.id === examId);

      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      // doménová logika

      if (exam.status !== "PUBLISHED") {
        return {
          status: "REJECTED",
          reason: "Termín není zveřejněn pro zápis",
        };
      }

      if (exam.registeredCount >= exam.capacity) {
        return {
          status: "REJECTED",
          reason: "Kapacita termínu je již naplněna",
        };
      }

      const isAlreadyRegistered = db.registrations.find(
        (r) =>
          r.userId === verifiedUserId &&
          r.examId === examId &&
          r.status === "REGISTERED",
      );

      if (isAlreadyRegistered) {
        return {
          status: "REJECTED",
          reason: "Student je již zaregistrován",
        };
      }

      // skutečné zaregistrování
      const registration = {
        id: crypto.randomUUID(),
        userId: verifiedUserId,
        examId,
        status: "REGISTERED",
      };

      db.registrations.push(registration);
      exam.registeredCount += 1;

      return {
        status: "SUCCESS",
        registration: structuredClone(registration),
        exam: structuredClone(exam),
      };
    },

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async unpublishExamTerm(examId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // existuje termín?
      const exam = db.exams.find((e) => e.id === examId);
      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }
      // doménová logika

      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Termín je již zrušen",
        };
      }

      if (exam.status === "DRAFT") {
        return {
          status: "REJECTED",
          reason: "Termín je již stažen ze zveřejnění",
        };
      }

      // termín má aktivní rezervace?
      const hasRegistrations = db.registrations.some(
        (r) => r.examId === examId && r.status === "REGISTERED",
      );

      if (hasRegistrations) {
        return {
          status: "REJECTED",
          reason: "Termín má přihlášené studenty a nelze jej stáhnout",
        };
      }

      // skutečné zrušení termínu
      exam.status = "DRAFT";

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    // má vracet { status, reason} nebo { result, registration, exam }
    // status = SUCCESS | REJECTED
    async unregisterFromExam(examId, userId, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "STUDENT") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      const verifiedUserId = user.userId;

      const exam = db.exams.find((e) => e.id === examId);

      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      // existuje registrace?
      const registration = db.registrations.find(
        (r) =>
          r.userId === verifiedUserId &&
          r.examId === examId &&
          r.status === "REGISTERED",
      );

      if (!registration) {
        return {
          status: "REJECTED",
          reason: "Registrace neexistuje",
        };
      }

      // odhlásit se je možné jen z publikovaného termínu
      if (exam.status !== "PUBLISHED") {
        return {
          status: "REJECTED",
          reason: "Odregistrace je možná jen z publikovaného termínu",
        };
      }

      // zrušení registrace
      registration.status = "CANCELED";
      exam.registeredCount -= 1;

      return {
        status: "SUCCESS",
        registration: structuredClone(registration),
        exam: structuredClone(exam),
      };
    },

    // má vracet { status, reason} nebo { status, exam}
    // status = SUCCESS | REJECTED
    async updateExamCapacity(examId, capacity, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      const exam = db.exams.find((e) => e.id === examId);

      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      if (!Number.isInteger(capacity) || capacity < 0) {
        return {
          status: "REJECTED",
          reason: "Neplatná kapacita",
        };
      }

      if (capacity < exam.registeredCount) {
        return {
          status: "REJECTED",
          reason: "Kapacita je menší než počet registrovaných studentů",
        };
      }

      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Nelze zmenit kapacitu zrušeného termínu",
        };
      }

      // zmena kapacity
      exam.capacity = capacity;
      return { status: "SUCCESS", exam: structuredClone(exam) };
    },

    async updateExamTerm(examId, data, token) {
      await delay();

      // existuje token?
      if (!token) {
        return {
          status: "REJECTED",
          reason: "Uživatel není přihlášený",
        };
      }

      // existuje uživatel podle tokenu?
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return {
          status: "REJECTED",
          reason: "Neplatný token",
        };
      }

      // má uživatel oprávnění?
      if (user.role !== "TEACHER") {
        return {
          status: "REJECTED",
          reason: "Uživatel nemá oprávnění",
        };
      }

      // doménová logika
      const exam = db.exams.find((e) => e.id === examId);

      if (!exam) {
        return {
          status: "REJECTED",
          reason: "Termín neexistuje",
        };
      }

      // změna zkouškového termínu
      if (exam.status === "CANCELED") {
        return {
          status: "REJECTED",
          reason: "Nelze zmenit zrušený termín",
        };
      }

      // validace vstupních dat

      const { name, date, capacity } = data;

      // name
      if (name !== undefined) {
        if (typeof name !== "string" || name.trim() === "") {
          return {
            status: "REJECTED",
            reason: "Neplatný název termínu",
          };
        }
      }

      // date
      if (date !== undefined) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return {
            status: "REJECTED",
            reason: "Neplatný datum termínu",
          };
        }
      }

      // capacity
      if (capacity !== undefined) {
        if (typeof capacity !== "number" || capacity < 0) {
          return {
            status: "REJECTED",
            reason: "Neplatná kapacita termínu",
          };
        }
      }

      const registeredCount = db.registrations.filter(
        (r) => r.examId === exam.id && r.status === "REGISTERED",
      ).length;

      if (capacity < registeredCount) {
        return {
          status: "REJECTED",
          reason: "Kapacita je menší než počet registrovaných studentů",
        };
      }

      // zmena zkouškového termínu
      if (name !== undefined) {
        exam.name = name;
      }
      if (date !== undefined) {
        exam.date = date;
      }
      if (capacity !== undefined) {
        exam.capacity = capacity;
      }

      return { status: "SUCCESS", exam: structuredClone(exam) };
    },
  };
}
