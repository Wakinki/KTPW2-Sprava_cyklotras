export function scheduleEventListHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const { canBackToDashboard, canEnterDetail, canEnterAdministration, canCreateScheduleEvent } = capabilities;

  const handlers = {};

  // nová akce
  if (canBackToDashboard) {
    handlers.onBackToDashboard = () => dispatch({ type: 'ENTER_DASHBOARD' });
  }

  if (canEnterDetail) {
    handlers.onEnterDetail = (scheduleEventId) =>
      dispatch({
        type: 'ENTER_SCHEDULE_EVENT_DETAIL',
        payload: { scheduleEventId },
      });
  }

  if (canEnterAdministration) {
    handlers.onEnterAdministration = (scheduleEventId) =>
      dispatch({
        type: 'ENTER_SCHEDULE_EVENT_ADMINISTRATION',
        payload: { scheduleEventId },
      });
  }

  if (canCreateScheduleEvent) {
    handlers.onCreateScheduleEvent = (data) =>
      dispatch({
        type: 'CREATE_SCHEDULE_EVENT',
        payload: data,
      });
  }

  return handlers;
}
