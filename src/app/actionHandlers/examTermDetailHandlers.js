/* viewState má tvar:
 *  {
 *    type: 'EXAM_TERM_DETAIL',
 *    exam,
 *    capabilities: {
 *      canBackToList: true,
 *      canEnterAdministration: canEnterAdministration(state),
 *      canRegister: canRegister(state),
 *      canUnregister: canUnregister(state),
 *      canPublish: canPublish(state),
 *      canUnpublish: canUnpublish(state),
 *      canCancel: canCancel(state),
 *      canDelete: canDelete(state),
 *    },
 *  }
 */
export function examTermDetailHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const {
    canBackToList,
    canEnterAdministration,
    canRegister,
    canUnregister,
    canPublish,
    canUnpublish,
    canCancel,
    canDelete,
  } = capabilities;
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

  if (!examId) {
    return handlers;
  }

  // canEnterAdministration: canEnterAdministration(state)
  if (canEnterAdministration) {
    handlers.onEnterAdministration = () =>
      dispatch({
        type: 'ENTER_EXAM_TERM_ADMINISTRATION',
        payload: { examId },
      });
  }

  /*******************************************
   * doménové akce, na základě kontextu
   *
   *******************************************/

  // canRegister: canRegister(state)
  if (canRegister) {
    handlers.onRegister = () =>
      dispatch({
        type: 'REGISTER_FOR_EXAM_TERM',
        payload: { examId },
      });
  }

  // canUnregister: canUnregister(state)
  if (canUnregister) {
    handlers.onUnregister = () =>
      dispatch({
        type: 'UNREGISTER_FROM_EXAM',
        payload: { examId },
      });
  }

  //  canPublish: canPublish(state)
  if (canPublish) {
    handlers.onPublish = () =>
      dispatch({
        type: 'PUBLISH_EXAM_TERM',
        payload: { examId },
      });
  }

  //  canUnpublish: canUnpublish(state)
  if (canUnpublish) {
    handlers.onUnpublish = () =>
      dispatch({
        type: 'UNPUBLISH_EXAM_TERM',
        payload: { examId },
      });
  }

  //  canCancel: canCancel(state)
  if (canCancel) {
    handlers.onCancel = () =>
      dispatch({
        type: 'CANCEL_EXAM_TERM',
        payload: { examId },
      });
  }

  // canDelete: canDelete(state)
  if (canDelete) {
    handlers.onDelete = () =>
      dispatch({
        type: 'DELETE_EXAM_TERM',
        payload: { examId },
      });
  }

  return handlers;
}
