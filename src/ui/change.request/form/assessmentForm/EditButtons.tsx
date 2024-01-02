import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { ChangeRequest, ChangeRequestStatus } from '../../../../state/ducks/changeRequest/types';
import { companyActions } from '../../../../state/ducks/company';
import { useFormContext } from '../../../components/forms/FormContext';
import { Button } from '../../../components/forms/fields-next';
import { useCanUpdateChangeRequest } from '../../helpers';
import { changeRequestPreviewPath, changeRequestUpdatePath } from '../../utils/paths';

export const EditButtons: React.FC<{ changeRequest: ChangeRequest }> = ({ changeRequest }) => {
  const isInReview = changeRequest?.state === ChangeRequestStatus.InReview;
  const canEditChangeRequest = useCanUpdateChangeRequest(changeRequest, true);
  const history = useHistory();
  const formContext = useFormContext();
  const dispatch = useDispatch();

  const editChangeRequest = () => {
    history.push(changeRequestUpdatePath(changeRequest.id));
  };

  const undoChanges = () => {
    dispatch(companyActions.setAutosaveConfig(true));
    history.push(changeRequestPreviewPath(changeRequest.id));
  };

  if (!isInReview || !canEditChangeRequest) {
    return null;
  }

  return (
    formContext.isEditing
      ? (<Button kind="white" onClick={undoChanges}>{translate('documentRevision.update.undo.changes')}</Button>)
      : (<Button kind="white" onClick={editChangeRequest}>{translate('common.edit')}</Button>)
  );
};
