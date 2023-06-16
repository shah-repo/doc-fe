import { cloneDeep, map } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../state/types';
import { useFormContext } from '../../components/forms/FormContext';
import { FB, FBForm, FBFormState, FBWorkspaceModeOptions } from '../../form.builder';
import ItemsAndDetailsState from '../items.and.details/ItemsAndDetails.state';
import { formDataToStoreData, storeDataToFormData } from './helpers';
import ItemsAndDetails from './ItemsAndDetails';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from './ItemsAndDetails.types';

const ItemsAndDetailsContainer: React.FunctionComponent<
ItemsAndDetailsWrapperProps & {name: string}
> = ({
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
    const { justificationOfChange, descriptionOfChange, proposedDocumentRevision }
      = formState?.getValues() as FBDocumentRevisionsValue;
    const orderItemsUpdated = itemsAndDetailsState.approvalRequestItemsList
      .map((item: ApprovalRequestGridItem) => {
        if (item.docRevId !== proposedDocumentRevision.id) {
          return item;
        }

        return { ...item, justificationOfChange, descriptionOfChange };
      });

    const dataToSend: FBDocumentRevisionsValue[]
      = storeDataToFormData(orderItemsUpdated);
    submitData(dataToSend);
  };

  const submitData = (dataToSend) => {
    parentFormState?.setFieldValue(name, cloneDeep(dataToSend), true);
    if (autosave) {
      submitForm();
      itemsAndDetailsState.setLoadingState(true);
      initialAsyncStatus.current = asyncState?.status;
      setTimeout(() => {
        if (asyncState?.status === initialAsyncStatus.current) {
          itemsAndDetailsState.setLoadingState(false);
          itemsAndDetailsState.setViewItemActionsVisibility(true);
        }
      }, 2000);
    } else {
      // Edit the itemsAndDetailsState & set the approvalRequestItemsList to dataToSend
      const entries = formDataToStoreData(dataToSend, changeRequest?.documentRevisions);
      itemsAndDetailsState.setApprovalRequestItemsList(entries);
    }
  };

  useEffect(() => {
    initialAsyncStatus.current = asyncState?.status;
    if (asyncState && (asyncState.status === AsyncStatus.Success
      || asyncState.status === AsyncStatus.Error)) {
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
  }, [JSON.stringify(changeRequest?.documentRevisions.map((docRev: DocumentRevision) => docRev.id) ?? []), changeRequest?.formInput]);

  const processChangeRequest = () => {
    let currentDocRevPresent = false;
    let entries: any[] = [];
    if (changeRequest) {
      const documentRevisionsData = changeRequest.documentRevisions;

      const documentRevisionsAssigned: FBDocumentRevisionsValue[] = changeRequest.formInput?.documentRevisions ?? [];
      // Happens only when one of the expressAR options is chosen, not when viewing from the link
      if (currentDocRevId) {
        currentDocRevPresent = documentRevisionsAssigned.findIndex(
          (docRev: FBDocumentRevisionsValue) => (docRev.proposedDocumentRevision.id === currentDocRevId)) !== -1;
      }

      entries = formDataToStoreData(documentRevisionsAssigned, documentRevisionsData);
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
      formState = {formState}
      handleAdd = {handleAdd}
      handleRemove = {handleRemove}
      handleUpdate = {handleUpdate}
      itemsAndDetailsState = {itemsAndDetailsState}
    />
  ));
};

const ItemsAndDetailsWrapper: React.FunctionComponent<ItemsAndDetailsWrapperProps> = ({
  changeRequest,
  initialValues,
  autosave,
  mode,
  asyncState,
  currentDocRevId,
}) => (
  <FBForm {...{ initialValues }}>
    <ItemsAndDetailsContainer
      currentDocRevId={currentDocRevId}
      changeRequest={changeRequest}
      name="documentRevisions"
      autosave={autosave}
      initialValues={initialValues}
      mode={mode}
      asyncState={asyncState}
    />
  </FBForm>
);

export default ItemsAndDetailsWrapper;
