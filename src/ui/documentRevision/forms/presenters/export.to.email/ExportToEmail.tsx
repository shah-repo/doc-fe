import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-ui/core';
import { omit } from 'lodash';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { Dialog } from '../../../../components/dialogs';
import { toastError, toastSuccess } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import ExportToEmailModal from './ExportToEmailModal';
interface Props {
  revisionId: string
  canAccess: boolean
  renderAsButton?: boolean
}

export interface attachmentsInfo {
  id: string
  name: string
  type: string
}

const ExportToEmail: React.FunctionComponent<Props> = ({
  revisionId,
  canAccess,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const emailDialog = useDialog();

  const async = useAsync({
    onSuccess: () => {
      emailDialog.close();
      toastSuccess(intl.formatMessage({ id: 'common.send.to.email.success' }));
    },
    onError: () => {
      if (!canAccess) {
        toastError(
          intl.formatMessage({ id: 'common.send.to.email.no.access' }),
        );
        return;
      }
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const exportToEmail = useActionCreator(
    documentRevisionsActions.exportToEmail,
  );
  const childFormRef = useRef();

  const runExportWithChildren = () => {
    if (childFormRef.current) {
      const values = omit(childFormRef.current.getValues(), 'includeDate');
      async.start(
        exportToEmail,
        revisionId,
        { ...values, includeAuditLogs: Boolean(values?.includeAuditLogs) },
        async,
      );
    }
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (
          <StyledMenuListItem
            button
            alignItems="flex-start"
            onClick={emailDialog.open}
          >
            <StyledMenuListIcon>
              <FontAwesomeIcon icon={regular('share')} size="lg" />
            </StyledMenuListIcon>
            <StyledMenuListItemText
              data-cy="export-to-email"
              primary={<Text translation="common.share" />}
            />
          </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          data-cy="export-to-email"
          onClick={emailDialog.open}
        >
          <Text translation="common.share" />
        </StyledButton>
      );
    }

    return (
      <>
        <Button
          data-cy="export-to-email"
          variant="outlined"
          color="secondary"
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </Button>
      </>
    );
  };

  return (
    <>
      {getUpdatedButton()}
      <Dialog
        title="common.send.to.email"
        open={emailDialog.isOpen}
        loading={async.isLoading}
        confirmLabel="common.confirm"
        cancelLabel="common.cancel"
        onClose={emailDialog.close}
        onConfirm={runExportWithChildren}
      >
        <ExportToEmailModal ref={childFormRef} {...{ revisionId }} />
      </Dialog>
    </>
  );
};

export default ExportToEmail;
