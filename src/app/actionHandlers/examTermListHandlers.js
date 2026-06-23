/* viewState ma tvar:
 *  {
 *    type: 'EXAM_TERM_LIST',
 *    exams,
 *    capabilities: {
 *      canEnterDetail: true,
 *      canEnterAdministration: canEnterAdministration(state),
 *      canCreateExam: canCreateExam(state),
 *    },
 *  }
 */
export function examTermListHandlers(dispatch, viewState) {
  const { capabilities } = viewState;
  const { canEnterDetail, canEnterAdministration, canCreateExam } = capabilities;

  const handlers = {};

  if (canEnterDetail) {
    handlers.onEnterDetail = (examId) =>
      dispatch({
        type: 'ENTER_EXAM_TERM_DETAIL',
        payload: { examId },
      });
  }

  if (canEnterAdministration) {
    handlers.onEnterAdministration = (examId) =>
      dispatch({
        type: 'ENTER_EXAM_TERM_ADMINISTRATION',
        payload: { examId },
      });
  }

  if (canCreateExam) {
    handlers.onCreateExamTerm = (data) =>
      dispatch({
        type: 'CREATE_EXAM_TERM',
        payload: data,
      });
  }

  return handlers;
}
