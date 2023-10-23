import Button, { ButtonProps } from '@material-ui/core/Button';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../../App';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { changeRequestsActions, changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestTransition, ChangeRequestTransitionResponse } from '../../../../state/ducks/changeRequest/types';
import { AsyncStatus } from '../../../../state/types';
import Text from '../../../components/Text';
import FormMessage from '../../../components/forms/FormMessage';
import FormProgress from '../../../components/forms/FormProgress';
import SubmitButton from '../../../components/forms/SubmitButton';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import DependentOnDocRevsDialog from '../../items.and.details/DependentOnDocRevsDialog';

interface Props {
  transition: ChangeRequestTransition
  label: string
  changeRequestId: string
  buttonProps?: ButtonProps
  isSubmitButtonShown?: boolean
  changeRequest?: ChangeRequest
}

const TransitionButton: React.FunctionComponent<Props> = ({
  transition,
  label,
  changeRequestId,
  buttonProps,
  changeRequest,
  isSubmitButtonShown = false,
}) => {
  const applyTransition = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync<ChangeRequestTransitionResponse>();
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
  const { _formState } = SM.useStores();
  const dependentOnDocRevsDialog = useDialog();
  const openDependentOnDocRevsDialog = () => {
    dependentOnDocRevsDialog.open();
  };

  const dependentOnDocRevs = useSelector(changeRequestsSelectors?.getDependentOnDocRevsState);
  const [openDependentDialog, setOpenDependentDialog] = useState(false);
  useEffect(() => {
    if ((dependentOnDocRevs.itemsPending > 0 || dependentOnDocRevs.itemsInDraft > 0 || dependentOnDocRevs.itemsInvalid > 0)
      && openDependentDialog) {
      openDependentOnDocRevsDialog();
    }
  }, [dependentOnDocRevs]);

  const onClick = () => {
    _formState?.validate((valid) => {
      if (valid) {
        setOpenDependentDialog(true);
        async.start(
          applyTransition,
          changeRequestId,
          { password: '' },
          transition,
          async,
        );
      }
    });
  };

  const closeDialog = () => {
    dependentOnDocRevsDialog.close();
    setOpenDependentDialog(false);
  };

  if (isSubmitButtonShown) {
    return (
      <React.Fragment>
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} attached />
        <SubmitButton
          id="transitionButton"
          showNewButton={true}
          asyncState={async.asyncState}
          onClick={onClick}
          dataCy={label}
          label={label} />
        {
        dependentOnDocRevsDialog?.isOpen
      && <DependentOnDocRevsDialog
        changeRequest={changeRequest}
        details={dependentOnDocRevs}
        dialog={dependentOnDocRevsDialog}
        closeAction={closeDialog}
      />
        }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <FormMessage asyncState={async.asyncState} />
      <FormProgress asyncState={async.asyncState} />
      {isNewLayout ? (
        <StyledButton
          id="transitionButton"
          data-cy="transitionButton"
          color="primary"
          onClick={onClick}
          disabled={async.asyncState.status === AsyncStatus.Active}
          {...buttonProps}
        >
          <Text message={label} />
        </StyledButton>
      ) : (
        <Button
          id="transitionButton"
          data-cy="transitionButton"
          color="secondary"
          variant="outlined"
          onClick={onClick}
          disabled={async.asyncState.status === AsyncStatus.Active}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
      )}
    </React.Fragment>
  );
};

export default TransitionButton;
