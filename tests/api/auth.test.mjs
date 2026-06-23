// tests/api/auth.test.mjs
//
// Spuštění: node tests/api/auth.test.mjs
//
// Testy autentizačního API: whoAmI, register, login, logout.

import { assert } from "../assert.js";
import { createAuthApi } from "../../src/api/authApi.js";

// =====================================================================
// whoAmI
// =====================================================================

console.log("\n── whoAmI ──");

// úspěšné ověření tokenu
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_abc123" },
    ],
  };
  const result = await createAuthApi(db).whoAmI("teacher-1_abc123");
  assert(result.status === "SUCCESS", "whoAmI – platný token → SUCCESS");
  assert(result.userId === "teacher-1", "whoAmI – vrátí správné userId");
  assert(result.role === "TEACHER", "whoAmI – vrátí správnou roli");
}

// chybějící token
{
  const db = { users: [] };
  const result = await createAuthApi(db).whoAmI(null);
  assert(result.status === "REJECTED", "whoAmI – chybějící token → REJECTED");
}

// neplatný token
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_abc123" },
    ],
  };
  const result = await createAuthApi(db).whoAmI("spatny-token");
  assert(result.status === "REJECTED", "whoAmI – neplatný token → REJECTED");
}

// uživatel nemá token (není přihlášen)
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: null },
    ],
  };
  const result = await createAuthApi(db).whoAmI(null);
  assert(result.status === "REJECTED", "whoAmI – uživatel bez tokenu → REJECTED");
}

// =====================================================================
// register
// =====================================================================

console.log("\n── register ──");

// úspěšná registrace studenta
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });
  assert(result.status === "SUCCESS", "register – úspěšná registrace studenta");
  assert(db.users.length === 1, "register – uživatel je přidán do db");
  assert(db.users[0].username === "novak", "register – username je správně uložen");
  assert(db.users[0].role === "STUDENT", "register – role je správně uložena");
  assert(db.users[0].token === null, "register – token je null po registraci");
  assert(typeof db.users[0].hashedPassword === "string", "register – heslo je uloženo jako hash");
  assert(db.users[0].hashedPassword !== "heslo123", "register – heslo není uloženo v čitelné podobě");
}

// úspěšná registrace učitele
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "TEACHER",
  });
  assert(result.status === "SUCCESS", "register – úspěšná registrace učitele");
  assert(db.users[0].role === "TEACHER", "register – role TEACHER je správně uložena");
}

// úspěšná registrace rozvrháře
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "planova",
    password: "heslo123",
    role: "SCHEDULER",
  });
  assert(result.status === "SUCCESS", "register – úspěšná registrace rozvrháře");
  assert(db.users[0].role === "SCHEDULER", "register – role SCHEDULER je správně uložena");
}

// chybějící username
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    password: "heslo123",
    role: "STUDENT",
  });
  assert(result.status === "REJECTED", "register – chybějící username → REJECTED");
}

// chybějící password
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "novak",
    role: "STUDENT",
  });
  assert(result.status === "REJECTED", "register – chybějící password → REJECTED");
}

// chybějící role
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
  });
  assert(result.status === "REJECTED", "register – chybějící role → REJECTED");
}

// neplatná role
{
  const db = { users: [] };
  const result = await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "ADMIN",
  });
  assert(result.status === "REJECTED", "register – neplatná role → REJECTED");
  assert(db.users.length === 0, "register – uživatel není přidán při neplatné roli");
}

// =====================================================================
// login
// =====================================================================

console.log("\n── login ──");

// úspěšné přihlášení
{
  const db = { users: [] };
  // nejprve zaregistrujeme uživatele
  await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });

  const result = await createAuthApi(db).login({
    username: "novak",
    password: "heslo123",
  });
  assert(result.status === "SUCCESS", "login – úspěšné přihlášení");
  assert(result.role === "STUDENT", "login – vrátí správnou roli");
  assert(typeof result.userId === "string", "login – vrátí userId");
  assert(typeof result.token === "string", "login – vrátí token");
  assert(result.token !== null, "login – token není null");
  assert(db.users[0].token === result.token, "login – token je uložen v db");
}

// chybějící username
{
  const db = { users: [] };
  const result = await createAuthApi(db).login({
    password: "heslo123",
  });
  assert(result.status === "REJECTED", "login – chybějící username → REJECTED");
}

// chybějící password
{
  const db = { users: [] };
  const result = await createAuthApi(db).login({
    username: "novak",
  });
  assert(result.status === "REJECTED", "login – chybějící password → REJECTED");
}

// neexistující uživatel
{
  const db = { users: [] };
  const result = await createAuthApi(db).login({
    username: "neexistuje",
    password: "heslo123",
  });
  assert(result.status === "REJECTED", "login – neexistující uživatel → REJECTED");
}

// špatné heslo
{
  const db = { users: [] };
  await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });

  const result = await createAuthApi(db).login({
    username: "novak",
    password: "spatne-heslo",
  });
  assert(result.status === "REJECTED", "login – špatné heslo → REJECTED");
}

// opakované přihlášení přepíše token
{
  const db = { users: [] };
  await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });

  const result1 = await createAuthApi(db).login({ username: "novak", password: "heslo123" });
  const result2 = await createAuthApi(db).login({ username: "novak", password: "heslo123" });

  assert(result1.status === "SUCCESS", "login opakované – první přihlášení SUCCESS");
  assert(result2.status === "SUCCESS", "login opakované – druhé přihlášení SUCCESS");
  assert(result1.token !== result2.token, "login opakované – tokeny jsou různé");
  assert(db.users[0].token === result2.token, "login opakované – db obsahuje nový token");
}

// =====================================================================
// logout
// =====================================================================

console.log("\n── logout ──");

// úspěšné odhlášení
{
  const db = { users: [] };
  await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });
  const loginResult = await createAuthApi(db).login({
    username: "novak",
    password: "heslo123",
  });

  const result = await createAuthApi(db).logout(loginResult.token);
  assert(result.status === "SUCCESS", "logout – úspěšné odhlášení");
  assert(db.users[0].token === null, "logout – token je null po odhlášení");
}

// chybějící token
{
  const db = { users: [] };
  const result = await createAuthApi(db).logout(null);
  assert(result.status === "REJECTED", "logout – chybějící token → REJECTED");
}

// neplatný token
{
  const db = {
    users: [
      { userId: "teacher-1", name: "Petr Nový", role: "TEACHER", token: "teacher-1_abc123" },
    ],
  };
  const result = await createAuthApi(db).logout("spatny-token");
  assert(result.status === "REJECTED", "logout – neplatný token → REJECTED");
}

// po odhlášení whoAmI selže
{
  const db = { users: [] };
  await createAuthApi(db).register({
    username: "novak",
    password: "heslo123",
    role: "STUDENT",
  });
  const loginResult = await createAuthApi(db).login({
    username: "novak",
    password: "heslo123",
  });
  const token = loginResult.token;

  await createAuthApi(db).logout(token);

  const whoResult = await createAuthApi(db).whoAmI(token);
  assert(whoResult.status === "REJECTED", "logout – po odhlášení whoAmI selže");
}

console.log("\n── Hotovo ──\n");
