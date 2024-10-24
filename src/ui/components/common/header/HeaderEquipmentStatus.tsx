import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../state/ducks/company';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, EquipmentStatus } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
import { styles } from '../../../app/alert.dialog/AlertDialog.styles';
import AlertDialog from '../../../components/dialogs/Alert';
import { getLatestRevisionId } from '../../../document.revision/utils/helpers';
import { isDocumentRevisionInStatus } from '../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import HeaderStatusButton from './HeaderStatusButton';

interface Props {
  documentRevision: DocumentRevision
}

const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];

const HeaderEquipmentStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateEquipmentStatusAction = useActionCreator(documentRevisionsActions.updateEquipmentStatus);
  const classes = styles();

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermissionToChangeEquipmentStatus = useSelector(getHasPermission(Permission.EDIT_EQ_STATUS));
  const isVoidedOrObsolete = isDocumentRevisionInStatus([DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided], documentRevision.status);
  const canChangeEquipmentStatus = (isOwner || hasPermissionToChangeEquipmentStatus) && (!disabledStatuses.includes(documentRevision.status));
  const isEquipmentStatusEditable = canChangeEquipmentStatus && !isVoidedOrObsolete;
  const statusLabel = documentRevision.eqStatus || EquipmentStatus.Inactive;
  const [draftEquipmentStatus, setDraftEquipmentStatus] = React.useState(statusLabel);
  const { equipmentFamily: { equipmentStatuses } } = useSelector(companySelectors.getGeneralSettings);

  const options = (equipmentStatuses ?? Object.values(EquipmentStatus))
    .filter(value => value.isActive)
    .map(status => ({ value: status.name, label: status.name }));

  const handleEqStatusChange = (equipmentStatus) => {
    if (equipmentStatus === statusLabel) {
      return;
    }
    setDraftEquipmentStatus(equipmentStatus);
    confirmationDialog.open();
  };

  const confirmUpdate = () => {
    async.start(updateEquipmentStatusAction, documentRevision.id, { eqStatus: draftEquipmentStatus }, async);
  };

  return (
    <>
      <HeaderStatusButton
        onItemSelect={handleEqStatusChange}
        label={statusLabel}
        options={options}
        disabled={!isEquipmentStatusEditable}
        data-cy="equipment-status"
      />
      <AlertDialog
        handler={confirmationDialog}
        loading={async.isLoading}
        onConfirm={confirmUpdate}
        title="documentRevision.equipment.status.update.alert.title"
        confirmLabel="common.true"
        cancelLabel="common.false"
        warning={true}
      >
        <Typography data-cy="dialog-message" className={classes.contentText}>
          {translate('documentRevision.equipment.status.update.alert', {
            oldStatus: (<b>{statusLabel}</b>) as unknown as string,
            newStatus: (<b>{draftEquipmentStatus}</b>) as unknown as string,
          })}
        </Typography>
      </AlertDialog>
    </>
  );
};

export function shouldShowEQStatus (documentRevision?: DocumentRevision): boolean {
  if (!documentRevision) {
    return false;
  }

  const isEquipment = documentRevision.document.documentType.group === DOC_TYPE_GROUP.EQUIPMENT;
  if (!isEquipment) {
    return false;
  }

  const document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, documentRevision?.document.id ?? ''),
  );

  const lastRevisionId = getLatestRevisionId(document?.documentRevisions);

  return documentRevision.id === lastRevisionId;
}

export default withThemeNext(HeaderEquipmentStatus);
