import { Box } from '@material-ui/core';
import { isEmptyArray } from 'formik';
import { cloneDeep } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { authSelectors } from '../../../../../state/ducks/auth';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { Dam } from '../../../../../state/ducks/company/types';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import Text from '../../../../components/Text';
import { FBDAMFields } from '../../../../form.builder';
import { FBApprovalMatrixItem, FBApprovalRole } from '../../../../form.builder/FBApprovalMatrixField/FBApprovalMatrixField.types';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SyncMessageAlert from './SyncMessageAlert';
import SyncMessageDialog from './SyncMessageDialog';

const OUT_OF_SYNC_ALERT_DATA_KEY = 'outOfSyncAlertData';
interface Props {
  documentRevision: DocumentRevision
}

const SyncMessageDialogContainer: React.FC<Props> = ({
  documentRevision,
}) => {
  const { _documentRevisionFormState } = SM.useStores();
  const [isSyncMessageOpen, setIsSyncMessageOpen] = React.useState(false);
  const { formInput } = documentRevision;
  let showAsyncMessage = false;
  const generalSettings = useSelector(companySelectors.getGeneralSettings);
  const { addToDam, removeFromDam } = generalSettings?.approvalRoles;
  const dam = generalSettings?.approvalRoles?.dam;
  let updatedDAR = cloneDeep(formInput[FBDAMFields.DAR]) as FBApprovalRole[];
  const updatedDAM = cloneDeep(formInput[FBDAMFields.DAM]) as FBApprovalMatrixItem[];
  const showAlertDialog = localStorage.getItem(OUT_OF_SYNC_ALERT_DATA_KEY) as Dam;
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const dispatch = useDispatch();

  if(dam?.documentRevision?.id === documentRevision?.id && documentRevision.status !== DocumentRevisionStatus.Canceled) {
    showAsyncMessage = !dam?.isSynced && isOwner;
  }

  const removeItemsAtIndices = (items, indices) => {
    const sortedIndices = _.sortBy(indices).reverse();
    const newItems = [...items];
    _.pullAt(newItems, sortedIndices);
    return newItems;
  };

  const SyncLabelElement: React.FC<{label, subLabel}> = ({ label, subLabel }) => {
    return(
      <>
      <Text translation={label} />
      <Box marginTop={2} >
        <Text translation={subLabel} />
      </Box>
      </>
    );
  };

  const getSyncMessageTranslation = ( isSubLabel = false ) => {
    const addToDam = generalSettings?.approvalRoles?.addToDam;
    const removeFromDam = generalSettings?.approvalRoles?.removeFromDam;
    const roleAddedList = addToDam?.map(item => item.name).join(', ');
    const roleRemovedList = removeFromDam?.map(item => item.name).join(', ');
    if(addToDam.length > 0 && removeFromDam.length > 0) {
      if(isSubLabel) {
        return translate('dam.sync.message.role.added.removed.sub.label', {
          addedList: roleAddedList,
          role: removeFromDam?.length > 1 ? 'roles' : 'role',
          removedlist: roleRemovedList,
        });
      }
      return translate('dam.sync.message.role.added.removed.label', {
        roleAdded: addToDam?.length > 1 ? 'roles' : 'role',
        addedList: roleAddedList,
        roleRemoved: removeFromDam?.length > 1 ? 'roles' : 'role',
        removedlist: roleRemovedList,
      });
    }
    else if(addToDam.length > 0 && isEmptyArray(removeFromDam)) {
      if(isSubLabel) {
        return translate('dam.sync.message.role.added.sub.label', {
          addedList: roleAddedList,
          role: removeFromDam?.length > 1 ? 'roles' : 'role',
        });
      }
      return translate('dam.sync.message.role.added.label', {
        role: addToDam?.length > 1 ? 'roles' : 'role',
        addedList: roleAddedList,
      });
    }
    else if(isEmptyArray(addToDam) && removeFromDam.length > 0) {
      if(isSubLabel) {
        return translate('dam.sync.message.role.removed.sub.label', {
          role: removeFromDam?.length > 1 ? 'roles' : 'role',
          removedlist: roleRemovedList,
        });
      }
      return translate('dam.sync.message.role.removed.label', {
        role: removeFromDam?.length > 1 ? 'roles' : 'role',
        removedlist: roleRemovedList,
      });
    }
  };

  const getSyncLabel = () => {
    if([DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange].includes(documentRevision.status)) {
      return (<SyncLabelElement label={getSyncMessageTranslation()}
      subLabel={getSyncMessageTranslation(true)} />);
    }
    else if([DocumentRevisionStatus.InReview, DocumentRevisionStatus.Approved].includes(documentRevision.status)) {
      return (<SyncLabelElement label={getSyncMessageTranslation()}
      subLabel={translate('dam.sync.message.in.review.role.sub.label', { docId: dam.document.docId, rev: dam.documentRevision.displayRevision })} />);
    }
    else if(documentRevision.status === DocumentRevisionStatus.Released) {
      return (<SyncLabelElement label={getSyncMessageTranslation()}
      subLabel="dam.sync.message.released.role.sub.label" />);
    }
  };

  useEffect(() => {
    dispatch(companyActions.getGeneralSettings());
  }, []);

  useEffect(() => {
      setIsSyncMessageOpen(showAsyncMessage);
  }, [showAsyncMessage]);

  if(!isEmptyArray(addToDam)) {
    const lastIndex = cloneDeep(updatedDAR).sort((a, b) => b.index - a.index);
    addToDam.map((item, index) => {
      const newDarValue = {
        id: item.id,
        name: item.name,
        index: lastIndex[0].index + index + 1,
        groups: [],
        employees: [],
      } as FBApprovalRole;
      return updatedDAR.push(newDarValue);
    });
    updatedDAM.map(item => {
      for (let index = 0; index < addToDam.length; index++) {
        item.approvalRoles.admStage.push(false);
        item.approvalRoles.stage1.push(false);
        item.approvalRoles.stage2.push(false);
        item.approvalRoles.stage3.push(false);
      }
      return item;
    });
  }
  if(!isEmptyArray(removeFromDam)) {
    const removingARIndexes = removeFromDam.map(ar => {
      const removingAR = updatedDAR.find(dar => dar.id === ar.id);
      return removingAR?.index;
    });
    updatedDAM.map(item => {
      item.approvalRoles.admStage = removeItemsAtIndices(item.approvalRoles.admStage, removingARIndexes);
      item.approvalRoles.stage1 = removeItemsAtIndices(item.approvalRoles.stage1, removingARIndexes);
      item.approvalRoles.stage2 = removeItemsAtIndices(item.approvalRoles.stage2, removingARIndexes);
      item.approvalRoles.stage3 = removeItemsAtIndices(item.approvalRoles.stage3, removingARIndexes);
      return item;
    });
    updatedDAR = updatedDAR.filter(item => !removeFromDam.some(removeItem => removeItem.id === item.id));
  }

  const onCloseDialogClick = () => {
    setIsSyncMessageOpen(false);
    if([DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange].includes(documentRevision.status)) {
      documentRevision.formInput = { ...formInput, 'dar-built-in': updatedDAR, 'dam-built-in': updatedDAM };
      _documentRevisionFormState?.setDocumentRevision(documentRevision);
      localStorage.removeItem(OUT_OF_SYNC_ALERT_DATA_KEY);
      async.start(setDocumentRevision, documentRevision.id, { formInput: documentRevision.formInput }, async);
    }
    else {
      localStorage.setItem(OUT_OF_SYNC_ALERT_DATA_KEY, JSON.stringify(dam));
    }
  };

  const async = useAsync();
  const setDocumentRevision = useActionCreator(documentRevisionsActions.save);

  if(showAlertDialog && !showAlertDialog?.isSynced && isOwner && ![DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange].includes(documentRevision.status)) {
    return <SyncMessageAlert isOpen={showAlertDialog} dialogContent={getSyncLabel()} />;
  }

  return (
    <>
    {showAsyncMessage && <SyncMessageDialog { ...{ dam } } isOpen={isSyncMessageOpen} closeDialog={() => onCloseDialogClick()} dialogContent={getSyncLabel()} />}
    </>
  );
};

export default SyncMessageDialogContainer;
