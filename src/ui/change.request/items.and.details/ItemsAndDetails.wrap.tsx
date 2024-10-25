import { cloneDeep, map } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../state/types';
import { useFormContext } from '../../components/forms/FormContext';
import { FB, FBFormState, FBWorkspaceModeOptions } from '../../form.builder';
import ItemsAndDetailsState from '../items.and.details/ItemsAndDetails.state';
import { formDataToStoreData, storeDataToFormData } from './helpers';
import ItemsAndDetails from './ItemsAndDetails';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from './ItemsAndDetails.types';

interface Props extends ItemsAndDetailsWrapperProps {
  name: string
}

const ItemsAndDetailsContainer: React.FC<Props> = ({
  currentDocRevId,
  changeRequest,
  name,
  autosave,
  mode,
  asyncState,
}) => {
  const { formState: parentFormState } = FB.useStores();
  const formState = FB.useRef(FBFormState, {});
  const initialAsyncStatus = useRef(asyncState?.status);
  const formContext = useFormContext();
  const formInput = parentFormState?.getValues();

  const { submitForm } = useFormContext();

  const itemsAndDetailsState = FB.useRef<ItemsAndDetailsState>(ItemsAndDetailsState);

  const handleAdd = () => {
    const formValue = formState?.getValues() as FBDocumentRevisionsValue;
    formValue.id = FB.uniqid;

    map(formValue, (value, key) => {
      formState?.omitFieldValue(key);
    });

    const dataToSend: FBDocumentRevisionsValue[]
      = storeDataToFormData(itemsAndDetailsState.approvalRequestItemsList);
    dataToSend.push(formValue);

    submitData(dataToSend);
  };

  const handleRemove = (docRevId: string) => {
    const orderItemsFiltered = itemsAndDetailsState.approvalRequestItemsList
      .filter((item: ApprovalRequestGridItem) => item.docRevId !== docRevId);
    const dataToSend: FBDocumentRevisionsValue[]
      = storeDataToFormData(orderItemsFiltered);

    submitData(dataToSend);
  };

  const handleUpdate = () => {
    const { justificationOfChange, descriptionOfChange, proposedDocumentRevision, autoUpdate, revisionFormTo }
      = formState?.getValues() as FBDocumentRevisionsValue;
    const orderItemsUpdated = itemsAndDetailsState.approvalRequestItemsList
      .map((item: ApprovalRequestGridItem) => {
        if (item.docRevId !== proposedDocumentRevision.id) {
          return item;
        }

        return { ...item, justificationOfChange, descriptionOfChange, revisionFormTo, autoUpdate };
      });

    const dataToSend: FBDocumentRevisionsValue[]
      = storeDataToFormData(orderItemsUpdated);
    submitData(dataToSend);
  };

  const submitData = (dataToSend) => {
    parentFormState?.setFieldValue(name, cloneDeep(dataToSend), true);

    if (autosave && !formContext.isEditing) {
      submitForm();
      itemsAndDetailsState.setLoadingState(true);
      initialAsyncStatus.current = asyncState?.status;
      setTimeout(() => {
        if (asyncState?.status === initialAsyncStatus.current) {
          itemsAndDetailsState.setLoadingState(false);
        }
      }, 2000);
    } else {
      // Edit the itemsAndDetailsState & set the approvalRequestItemsList to dataToSend
      const entries = formDataToStoreData(dataToSend, changeRequest?.documentRevisions) as ApprovalRequestGridItem[];
      itemsAndDetailsState.setApprovalRequestItemsList(entries);
      itemsAndDetailsState.setViewItemActionsVisibility(true);
    }
  };

  useEffect(() => {
    initialAsyncStatus.current = asyncState?.status;
    if (asyncState && (asyncState.status === AsyncStatus.Success || asyncState.status === AsyncStatus.Error)) {
      // i.e. processing completed
      itemsAndDetailsState.setLoadingState(false);
      itemsAndDetailsState.setViewItemActionsVisibility(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncState?.status]);

  useEffect(() => {
    processChangeRequest();
    // Don't show the options to add / edit|delete in preview mode
    if (mode === FBWorkspaceModeOptions.PREVIEW) {
      itemsAndDetailsState.setViewItemActionsVisibility(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps, max-len
  }, [JSON.stringify(changeRequest?.documentRevisions.map((docRev: DocumentRevision) => docRev.id) ?? []), formInput, changeRequest]);

  const processChangeRequest = () => {
    let currentDocRevPresent = false;
    let entries: ApprovalRequestGridItem[] = [];
    if (changeRequest) {
      const documentRevisionsData = changeRequest.documentRevisions;

      const documentRevisionsAssigned = (formInput?.documentRevisions ?? []) as FBDocumentRevisionsValue[];
      // Happens only when one of the expressAR options is chosen, not when viewing from the link
      if (currentDocRevId) {
        currentDocRevPresent = documentRevisionsAssigned.some(docRev => docRev.proposedDocumentRevision.id === currentDocRevId);
      }

      entries = formDataToStoreData(documentRevisionsAssigned, documentRevisionsData) as ApprovalRequestGridItem[];
    }

    if (changeRequest && !currentDocRevPresent && currentDocRevId) {
      itemsAndDetailsState.setApprovalRequestItemInEditMode(currentDocRevId);
    } else {
      itemsAndDetailsState.setApprovalRequestItemInEditMode('');
    }

    itemsAndDetailsState.setApprovalRequestItemsList(entries);
  };

  return useObserver(() => (
    <ItemsAndDetails
      {...{
        changeRequest,
        formState,
        handleAdd,
        handleRemove,
        handleUpdate,
        itemsAndDetailsState,
      }}
    />
  ));
};

const ItemsAndDetailsWrapper: React.FunctionComponent<ItemsAndDetailsWrapperProps> = (props) => (
  <ItemsAndDetailsContainer name="documentRevisions" {...props} />
);

export default ItemsAndDetailsWrapper;
