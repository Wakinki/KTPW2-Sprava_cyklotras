export function scheduleEventDetailHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const {
    canBackToList,
    canEnroll,
    canCancelEnrollment,
    canOpen,
    canCancelScheduleEvent,
  } = capabilities;

  const handlers = {};
  const scheduleEventId = viewState.scheduleEvent?.id;

  if (canBackToList) {
    handlers.onBackToList = () =>
      dispatch({ type: "ENTER_SCHEDULE_EVENT_LIST" });
  }

  if (!scheduleEventId) {
    return handlers;
  }

  // STUDENT: zápisy
  if (canEnroll) {
    handlers.onEnroll = () =>
      dispatch({
        type: "ENROLL",
        payload: { scheduleEventId },
      });
  }

  if (canCancelEnrollment) {
    handlers.onCancelEnrollment = () =>
      dispatch({
        type: "CANCEL_ENROLLMENT",
        payload: { scheduleEventId },
      });
  }

  // TEACHER: změna stavu

  if (canOpen) {
    handlers.onOpen = () =>
      dispatch({
        type: "OPEN_SCHEDULE_EVENT",
        payload: { scheduleEventId },
      });
  }

  if (canCancelScheduleEvent) {
    handlers.onCancelScheduleEvent = () =>
      dispatch({
        type: "CANCEL_SCHEDULE_EVENT",
        payload: { scheduleEventId },
      });
  }

  return handlers;
}
