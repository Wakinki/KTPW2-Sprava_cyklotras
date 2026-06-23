/* viewState ma tvar: {
    type: 'EXAM_TERM_ADMINISTRATION',
    exam,
    capabilities: {
      canBackToList: true,
      canDelete: canDelete(state),
      canCancel: canCancel(state),
      canUpdateCapacity: canUpdateCapacity(state),
      canUpdate: canUpdate(state), // nastavení parametrů termínu - kapacita, název, čas
    },
  }
*/
export function examTermAdministrationHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const { canBackToList, canDelete, canCancel, canUpdateCapacity, canUpdate } = capabilities;
  const handlers = {};
  const examId = viewState.exam?.id;

  /*******************************************
   * navigační akce
   *
   ******************************************/
  // canBackToList: true
  if (canBackToList) {
    handlers.onBackToList = () => dispatch({ type: 'ENTER_EXAM_TERM_LIST' });
  }

  /*******************************************
   * doménové akce, na základě kontextu
   *
   *******************************************/
  if (!examId) {
    return handlers;
  }

  // canDelete: canDelete(state)
  if (canDelete) {
    handlers.onDelete = () =>
      dispatch({
        type: 'DELETE_EXAM_TERM',
        payload: { examId },
      });
  }

  // canCancel: canCancel(state)
  if (canCancel) {
    handlers.onCancel = () =>
      dispatch({
        type: 'CANCEL_EXAM_TERM',
        payload: { examId },
      });
  }

  // canUpdateCapacity: canUpdateCapacity(state)
  if (canUpdateCapacity) {
    handlers.onUpdateCapacity = (capacity) =>
      dispatch({
        type: 'UPDATE_EXAM_CAPACITY',
        payload: { examId, capacity },
      });
  }

  // canUpdate: canUpdate(state)
  if (canUpdate) {
    handlers.onUpdate = (data) =>
      dispatch({
        type: 'UPDATE_EXAM_TERM',
        payload: { examId, ...data },
      });
  }
  return handlers;
}
