// src/api/httpApi.js

import { createExamTermsHttpApi } from './examTermsHttpApi.js';
import { createAuthHttpApi } from './authHttpApi.js';
import { createScheduleEventsHttpApi } from './scheduleEventsHttpApi.js';

export function createHttpApi() {
  return {
    auth: createAuthHttpApi(),
    examTerms: createExamTermsHttpApi(),
    scheduleEvents: createScheduleEventsHttpApi(),
  };
}
