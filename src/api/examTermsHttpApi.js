// src/api/examTermsHttpApi.js

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

export function createExamTermsHttpApi() {
  return {
    // =========================
    // READ
    // =========================

    async getExams(token) {
      const response = await fetch(buildUrl('/api/exams'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await handleResponse(response);

      if (result.status === 'ERROR') return result;

      return {
        status: 'SUCCESS',
        exams: result.exams,
        registrations: result.registrations,
      };
    },

    // =========================
    // COMMANDS
    // =========================

    async cancelExamTerm(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/cancel`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async createExamTerm(payload, token) {
      const response = await fetch(buildUrl('/api/exams'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      return handleResponse(response);
    },

    async deleteExamTerm(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async publishExamTerm(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/publish`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async unpublishExamTerm(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/unpublish`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async registerForExam(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/register`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async unregisterFromExam(examId, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/unregister`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    async updateExamCapacity(examId, capacity, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}/capacity`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ capacity }),
      });

      return handleResponse(response);
    },

    async updateExamTerm(examId, data, token) {
      const response = await fetch(buildUrl(`/api/exams/${examId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    },
  };
}
