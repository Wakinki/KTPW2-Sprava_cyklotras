export function scheduleEventAdministrationHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const { canBackToList, canUpdateCapacity, canUpdateMaximalCapacity, canUpdateDetails, canDeleteScheduleEvent } =
    capabilities;
  const handlers = {};
  const scheduleEventId = viewState.scheduleEvent?.id;

  /*******************************************
   * navigační akce
   *
   ******************************************/
  // canBackToList: true
  if (canBackToList) {
    handlers.onBackToList = () => dispatch({ type: 'ENTER_SCHEDULE_EVENT_LIST' });
  }

  /*******************************************
     * doménové akce, na základě kontextu
     * 
    /***************************************** */

  if (!scheduleEventId) {
    return handlers;
  }

  // TEACHER a SCHEDULER: úprava detailů
  if (canUpdateDetails) {
    handlers.onUpdateDetails = (data) =>
      dispatch({
        type: 'UPDATE_SCHEDULE_EVENT_DETAILS',
        payload: { scheduleEventId, ...data },
      });
  }

  // TEACHER: úprava maximální kapacity
  if (canUpdateMaximalCapacity) {
    handlers.onUpdateMaximalCapacity = (maximalCapacity) =>
      dispatch({
        type: 'UPDATE_SCHEDULE_EVENT_MAXIMAL_CAPACITY',
        payload: { scheduleEventId, maximalCapacity },
      });
  }

  // SCHEDULER: úprava kapacity, smazání
  if (canUpdateCapacity) {
    handlers.onUpdateCapacity = (capacity) =>
      dispatch({
        type: 'UPDATE_SCHEDULE_EVENT_CAPACITY',
        payload: { scheduleEventId, capacity },
      });
  }

  if (canDeleteScheduleEvent) {
    handlers.onDelete = () =>
      dispatch({
        type: 'DELETE_SCHEDULE_EVENT',
        payload: { scheduleEventId },
      });
  }

  return handlers;
}
