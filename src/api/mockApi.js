// src/api/mockApi.js
import { createMockDatabase } from "./data.js";
import { createAuthApi } from "./authApi.js";
import { createRouteApi } from "./routeApi.js";
import { createSignApi } from "./signApi.js";
import { wrapApi } from "./apiWrapper.js";

const db = createMockDatabase();

export function createApi() {
 const api = {
    auth: createAuthApi(db),
    routes: createRouteApi(db),
    signs: createSignApi(db),
  };

 
  return wrapApi(api);
}