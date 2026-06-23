// src/api/authHttpApi.js

import { API_BASE_URL } from './config.js';

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function handleResponse(response) {
  if (!response.ok) {
    return { status: 'ERROR', reason: response.statusText };
  }

  try {
    return await response.json();
  } catch {
    return { status: 'ERROR', reason: 'Neplatná odpověď serveru' };
  }
}

export function createAuthHttpApi() {
  return {
    async whoAmI(token) {
      const response = await fetch(buildUrl('/api/auth/whoami'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },
  };
}
