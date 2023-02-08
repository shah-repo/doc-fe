import { cloneDeep, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../state/types";
import { useFormContext } from "../../components/forms/FormContext";
import { FB, FBForm, FBFormState, FBWorkspaceModeOptions } from "../../form.builder";
import { generateDocTitleText, newARDocRevToAdd, storeDataToFormData } from "./helpers";
import ItemsAndDetails from "./ItemsAndDetails";
import ItemsAndDetailsState from "./ItemsAndDetails.state";
import { ApprovalRequestGridItem, FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from "./ItemsAndDetails.types";

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

  const { submitForm } = useFormContext();

  const itemsAndDetailsState = FB.useRef<ItemsAndDetailsState>(ItemsAndDetailsState);

  const handleAdd = () => {
    const formValue = formState?.getValues() as FBDocumentRevisionsValue;
    formValue.id = FB.uniqid;

    map(formValue, (value, key) => {
      formState?.omitFieldValue(key);
    });

    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(itemsAndDetailsState.approvalRequestItemsList);
    dataToSend.push(formValue);

    submitData(dataToSend);
  };

  const handleRemove = (docRevId: string) => {
    const orderItemsFiltered = itemsAndDetailsState.approvalRequestItemsList
      .filter((item: ApprovalRequestGridItem) => item.docRevId !== docRevId);
    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(orderItemsFiltered);

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

    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(orderItemsUpdated);
    submitData(dataToSend);
  };

  const submitData = (dataToSend) => {
    parentFormState?.setFieldValue(name, cloneDeep(dataToSend), true);
    if (autosave) {
      submitForm();
      itemsAndDetailsState.setLoadingState(true);
    }
  };

  useEffect(() => reaction(
    () => itemsAndDetailsState.submitList,
    (submission) => {
      if (submission) {
        if (currentDocRevId) {
          const dataToSend: FBDocumentRevisionsValue[] =
            storeDataToFormData(itemsAndDetailsState.approvalRequestItemsList);
          dataToSend.push(newARDocRevToAdd(currentDocRevId));
          submitData(dataToSend);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [itemsAndDetailsState.submitList]);

  useEffect(() => {
    if (asyncState && (asyncState.status === AsyncStatus.Success ||
      asyncState.status === AsyncStatus.Error)) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequest]);

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

      entries = documentRevisionsAssigned.map((item: FBDocumentRevisionsValue) => {
        const entryInfo = {
          justificationOfChange: item.justificationOfChange,
          descriptionOfChange: item.descriptionOfChange,
          docRevId: item.proposedDocumentRevision.id,
          documentId: "",
          id: item.id,
          titleText: "",
          displayRevision: "",
          isPart: false,
        };

        const docRevId = item.proposedDocumentRevision.id;
        if (docRevId === currentDocRevId) {
          currentDocRevPresent = true;
        }
        const { displayRevision, name, document } =
        documentRevisionsData.find((docRev: DocumentRevision) => docRev.id === docRevId) ?? {};
        if (document) {
          entryInfo.titleText = generateDocTitleText(document.docId, displayRevision, name);
          entryInfo.isPart = document.documentType.group === DOC_TYPE_GROUP.PART;
          entryInfo.documentId = document.id;
          entryInfo.displayRevision = displayRevision;
        }

        return entryInfo;
      });
    }

    itemsAndDetailsState.setApprovalRequestItemsList(entries);
    if (changeRequest && !currentDocRevPresent && currentDocRevId) {
      setTimeout(() => {
        itemsAndDetailsState.setSubmitList(true);
      }, 100);
    }
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
