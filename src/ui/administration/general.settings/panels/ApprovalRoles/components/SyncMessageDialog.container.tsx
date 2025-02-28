import { Box } from '@material-ui/core';
import { isEmptyArray } from 'formik';
import { cloneDeep, pullAt, sortBy } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM } from '../../../../../../App';
import { translate } from '../../../../../../common/intl';
import { authSelectors } from '../../../../../../state/ducks/auth';
import { companyActions, companySelectors } from '../../../../../../state/ducks/company';
import { Dam } from '../../../../../../state/ducks/company/types';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import Text from '../../../../../components/Text';
import { isDocumentRevisionInStatus, isDocumentRevisionReleased } from '../../../../../documentRevision/helpers/documentRevisionStatus';
import { FBDAMFields } from '../../../../../form.builder';
import { FBApprovalMatrixItem, FBApprovalRole } from '../../../../../form.builder/FBApprovalMatrixField/FBApprovalMatrixField.types';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import SyncMessageAlert from './SyncMessageAlert';
import SyncMessageDialog from './SyncMessageDialog';

const OUT_OF_SYNC_ALERT_DATA_KEY = 'outOfSyncAlertData';

const SyncLabelElement: React.FC<{ label?: string, subLabel?: string }> = ({ label, subLabel }) => {
  return (
    <>
      <Text message={label} />
      <Box marginTop={2} >
        <Text message={subLabel} />
      </Box>
    </>
  );
};

function removeItemsAtIndices<T = unknown> (items: T[], indices: number[]): T[] {
  const sortedIndices = sortBy(indices).reverse();
  const newItems = [...items];
  pullAt(newItems, sortedIndices);
  return newItems;
}

interface Props {
  documentRevision: DocumentRevision
  reloadComponent?: () => void
}

const SyncMessageDialogContainer: React.FC<Props> = ({
  documentRevision,
  reloadComponent,
}) => {
  const { _documentRevisionFormState } = SM.useStores();
  const [isSyncMessageOpen, setIsSyncMessageOpen] = React.useState(false);
  const { formInput } = documentRevision;
  const generalSettings = useSelector(companySelectors.getGeneralSettings);
  const { addToDam = [], removeFromDam = [] } = generalSettings?.approvalRoles ?? {};
  const dam = generalSettings?.approvalRoles?.dam;
  let updatedDAR = cloneDeep(formInput?.[FBDAMFields.DAR] ?? []) as FBApprovalRole[];
  const updatedDAM = cloneDeep(
    formInput?.[FBDAMFields.DAM]?.approvalMatrix
    ?? formInput?.[FBDAMFields.DAM]
    ?? [],
  ) as FBApprovalMatrixItem[];
  const showAlertDialog = localStorage.getItem(OUT_OF_SYNC_ALERT_DATA_KEY) as unknown as Dam;
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const dispatch = useDispatch();
  const isDraftOrPending = isDocumentRevisionInStatus([DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange], documentRevision.status);

  const showAsyncMessage = dam?.documentRevision?.id === documentRevision?.id
    && documentRevision.status !== DocumentRevisionStatus.Canceled
    && !dam?.isSynced
    && isOwner;

  if (dam?.isSynced) {
    localStorage.removeItem(OUT_OF_SYNC_ALERT_DATA_KEY);
  }

  const getSyncMessageTranslation = (isSubLabel = false): string | undefined => {
    const addToDam = generalSettings?.approvalRoles?.addToDam ?? [];
    const removeFromDam = generalSettings?.approvalRoles?.removeFromDam;
    const roleAddedList = addToDam?.map(item => item.name).join(', ');
    const roleRemovedList = removeFromDam?.map(item => item.name).join(', ');
    if (addToDam?.length > 0 && removeFromDam.length > 0) {
      if (isSubLabel) {
        return translate('dam.sync.message.role.added.removed.sub.label', {
          addedList: roleAddedList,
          rolesCount: removeFromDam?.length,
          removedlist: roleRemovedList,
        });
      }
      return translate('dam.sync.message.role.added.removed.label', {
        roleAdded: addToDam?.length,
        addedList: roleAddedList,
        roleRemoved: removeFromDam?.length,
        removedlist: roleRemovedList,
      });
    } else if (addToDam?.length > 0 && isEmptyArray(removeFromDam)) {
      if (isSubLabel) {
        return translate('dam.sync.message.role.added.sub.label', {
          addedList: roleAddedList,
          rolesCount: removeFromDam?.length,
        });
      }
      return translate('dam.sync.message.role.added.label', {
        rolesCount: addToDam?.length,
        addedList: roleAddedList,
      });
    } else if (isEmptyArray(addToDam) && removeFromDam.length > 0) {
      if (isSubLabel) {
        return translate('dam.sync.message.role.removed.sub.label', {
          rolesCount: removeFromDam?.length,
          removedlist: roleRemovedList,
        });
      }
      return translate('dam.sync.message.role.removed.label', {
        rolesCount: removeFromDam?.length,
        removedlist: roleRemovedList,
      });
    }
  };

  const getSyncLabel = () => {
    if (isDraftOrPending) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel={getSyncMessageTranslation(true)}
        />
      );
    }

    if (isDocumentRevisionInStatus([DocumentRevisionStatus.InReview, DocumentRevisionStatus.Approved], documentRevision.status)) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel={translate('dam.sync.message.in.review.role.sub.label', {
            docId: dam.document.docId,
          })}
        />
      );
    }

    if (isDocumentRevisionReleased(documentRevision.status)) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel="dam.sync.message.released.role.sub.label"
        />
      );
    }
  };

  useEffect(() => {
    dispatch(companyActions.getGeneralSettings());
  }, []);

  useEffect(() => {
    setIsSyncMessageOpen(showAsyncMessage);
  }, [showAsyncMessage]);

  if (!isEmptyArray(addToDam)) {
    let lastIndex = Math.max(...updatedDAR.map(item => item.index));
    if (lastIndex === Number.NEGATIVE_INFINITY || !lastIndex) {
      lastIndex = 0;
    }

    addToDam?.forEach((item, index) => {
      const newDarValue: FBApprovalRole = {
        id: item.id,
        name: item.name,
        index: lastIndex + index + 1,
        groups: [],
        employees: [],
      };
      updatedDAR.push(newDarValue);
    });
    updatedDAM.forEach((item: FBApprovalMatrixItem) => {
      for (let index = 0; index < addToDam?.length; index++) {
        item.approvalRoles.admStage.push(false);
        item.approvalRoles.stage1.push(false);
        item.approvalRoles.stage2.push(false);
        item.approvalRoles.stage3.push(false);
      }
    });
  }

  if (!isEmptyArray(removeFromDam)) {
    const removingARIndexes = removeFromDam.map(ar => updatedDAR.findIndex(dar => dar.id === ar.id));
    updatedDAM.forEach((item: FBApprovalMatrixItem) => {
      item.approvalRoles.admStage = removeItemsAtIndices(item.approvalRoles.admStage, removingARIndexes);
      item.approvalRoles.stage1 = removeItemsAtIndices(item.approvalRoles.stage1, removingARIndexes);
      item.approvalRoles.stage2 = removeItemsAtIndices(item.approvalRoles.stage2, removingARIndexes);
      item.approvalRoles.stage3 = removeItemsAtIndices(item.approvalRoles.stage3, removingARIndexes);
    });
    updatedDAR = updatedDAR.filter(item => !removeFromDam.some(removeItem => removeItem.id === item.id));
  }

  const onCloseDialogClick = () => {
    setIsSyncMessageOpen(false);
    if (isDraftOrPending) {
      documentRevision.formInput = { ...formInput, [FBDAMFields.DAR]: updatedDAR, [FBDAMFields.DAM]: updatedDAM };
      _documentRevisionFormState?.setDocumentRevision(documentRevision);
      localStorage.removeItem(OUT_OF_SYNC_ALERT_DATA_KEY);
      async.start(setDocumentRevision, documentRevision.id, { formInput: documentRevision.formInput }, async);
      reloadComponent?.();
    } else {
      localStorage.setItem(OUT_OF_SYNC_ALERT_DATA_KEY, JSON.stringify(dam));
    }
  };

  const async = useAsync({
    onSuccess: () => {
      dispatch(companyActions.getGeneralSettings());
    },
  });
  const setDocumentRevision = useActionCreator(documentRevisionsActions.save);

  if (showAlertDialog && !showAlertDialog?.isSynced && isOwner && !isDraftOrPending) {
    return <SyncMessageAlert isOpen dialogContent={getSyncLabel()} />;
  }

  if (!showAsyncMessage) {
    return null;
  }

  return (
    <SyncMessageDialog
      isOpen={isSyncMessageOpen}
      closeDialog={onCloseDialogClick}
      dialogContent={getSyncLabel()}
      dam={dam}
    />
  );
};

export default SyncMessageDialogContainer;
