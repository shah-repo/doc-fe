import { Typography } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../../App';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { translate } from '../../../../common/intl';
import { changeRequestsActions, changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestTransition, ChangeRequestTransitionResponse } from '../../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../../state/ducks/company';
import { NotifyPartLCP } from '../../../../state/ducks/company/types';
import { AsyncStatus } from '../../../../state/types';
import { AlertDialog } from '../../../components/dialogs';
import FormMessage from '../../../components/forms/FormMessage';
import FormProgress from '../../../components/forms/FormProgress';
import SubmitButton from '../../../components/forms/SubmitButton';
import Text from '../../../components/Text';
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
  const applyTransitionWithIgnoreWarning = useActionCreator(changeRequestsActions.applyTransitionWithIgnoreWarning);

  const async = useAsync<ChangeRequestTransitionResponse>();
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
  const { _formState } = SM.useStores();
  const dependentOnDocRevsDialog = useDialog();
  const partLCPDialog = useDialog();
  const generalSetting = useSelector(companySelectors.getGeneralSettings);

  const openDependentOnDocRevsDialog = () => {
    dependentOnDocRevsDialog.open();
  };

  const openPartLCPDialog = () => {
    partLCPDialog.open();
  };

  const dependentOnDocRevs = useSelector(changeRequestsSelectors?.getDependentOnDocRevsState);
  const [openDependentDialog, setOpenDependentDialog] = useState(false);
  const isNotifyPartLCPWarning = generalSetting.shouldNotifyLcpMismatch === NotifyPartLCP.WARNING;
  const isNotifyPartLCPError = generalSetting.shouldNotifyLcpMismatch === NotifyPartLCP.ERROR;
  useEffect(() => {
    const isLCPItemsMismatching = dependentOnDocRevs.itemsLifecycleMismatching > 0 && openDependentDialog;
    if ((dependentOnDocRevs.itemsPending > 0 || dependentOnDocRevs.itemsInDraft > 0 || dependentOnDocRevs.itemsInvalid > 0)
      && openDependentDialog) {
      if (isNotifyPartLCPError && isLCPItemsMismatching) {
        openPartLCPDialog();
      } else {
        openDependentOnDocRevsDialog();
      }
    } else if (generalSetting.shouldNotifyLcpMismatch !== NotifyPartLCP.DO_NOTHING && isLCPItemsMismatching) {
      openPartLCPDialog();
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

  const lcpAsync = useAsync<ChangeRequest>({
    onSuccess: () => partLCPDialog.close(),
  });

  const onConfirmAlertDialog = () => {
    if (isNotifyPartLCPError) {
      partLCPDialog.close();
      return;
    }

    lcpAsync.reset();
    lcpAsync.start(
      applyTransitionWithIgnoreWarning,
      changeRequestId,
      { password: '' },
      transition,
      lcpAsync,
    );
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
          label={label}
        />
        {dependentOnDocRevsDialog?.isOpen && (
          <DependentOnDocRevsDialog
            changeRequest={changeRequest}
            details={dependentOnDocRevs}
            dialog={dependentOnDocRevsDialog}
            closeAction={closeDialog}
          />
        )}
        {partLCPDialog?.isOpen && (
          <AlertDialog
            handler={partLCPDialog}
            onConfirm={onConfirmAlertDialog}
            onCancel={() => partLCPDialog.close()}
            hideCancelButton={isNotifyPartLCPError}
            title={isNotifyPartLCPWarning ? 'common.warning' : 'common.alert'}
            confirmLabel={
              isNotifyPartLCPWarning ? 'common.yes.continue' : 'common.ok'
            }
            cancelLabel={
              isNotifyPartLCPWarning ? 'common.no.go.back' : undefined
            }
            warning={isNotifyPartLCPWarning}
          >
            <Typography data-cy="part-lcp-dialog-message">
              {isNotifyPartLCPWarning ? (
                <span>
                  {translate('bom.ar.part.lcp.notify.warning.message')}
                </span>
              ) : (
                <span>{translate('bom.ar.part.lcp.notify.alert.message')}</span>
              )}
            </Typography>
          </AlertDialog>
        )}
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
          data-cy="transition-button"
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
          data-cy="transition-button"
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
