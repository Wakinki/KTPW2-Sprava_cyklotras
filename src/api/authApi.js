import { delay } from "./utils.js";


function generateToken(userId) {
  const token = `${userId}_${crypto.randomUUID()}`;
  return token;
}


async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}


async function isPasswordCorrect(user, password) {
  const hashed = await hashPassword(password);
   console.log("isPasswordCorrect",hashed === user.hashedPassword)
  return hashed === user.hashedPassword;
}

export function createAuthApi(db) {
  return {
    async whoAmI(token) {

      if (!token) {
        return { status: "REJECTED", reason: "Uživatel není přihlášený" };
      }

      const user = db.users.find((u) => u.token === token);

      if (!user) {
        return { status: "REJECTED", reason: "Neplatný token" };
      }

      return { status: "SUCCESS", userId: user.userId, role: user.role };
    },

     async register(payload) {

      const { username, password } = payload;

      const role = "GUEST";
      
      const existingUser = db.users.find((u) => u.username === username);
      if (existingUser) {
        return { status: "REJECTED", reason: "Uživatelské jméno již existuje" };
      }

      const hashedPassword = await hashPassword(password);
      const userId = `user-${Date.now()}`;

      db.users.push({
        userId,
        username,
        name: username,
        role,
        hashedPassword,
        token: null,
      });

      return { status: "SUCCESS", userId, username, role };
    },

    async login(payload) {
  
      const {username, password} = payload

      const user = db.users.find((u) => u.username === username);

      if (!user) {
        return { status: "REJECTED", reason: "Neplatné uživatelské jméno" };
      }

      const isCorrect = await isPasswordCorrect(user, password);
  
      if (!isCorrect) {
        return { status: "REJECTED", reason: "Neplatné heslo" };
      }
      
      const userId = user.userId

      const token = generateToken(userId);
      user.token = token;

      return { status: "SUCCESS", role: user.role, userId, token };
    },

    async logout(token) {
      await delay();
      if (!token) {
        return { status: "REJECTED", reason: "Token nebyl poskytnut" };
      }
      const user = db.users.find((u) => u.token === token);
      if (!user) {
        return { status: "REJECTED", reason: "Neplatný token" };
      }
      user.token = null;
      return { status: "SUCCESS" };
    },
  };
}
