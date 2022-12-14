/* eslint-disable no-console */
import { cloneDeep, map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../state/types";
import { useFormContext } from "../../components/forms/FormContext";
import { FB, FBForm, FBFormState } from "../../form.builder";
import { generateDocTitleText, newARDocRevToAdd, storeDataToFormData } from "./helpers";
import ItemsAndDetails from "./ItemsAndDetails";
import ItemsAndDetailsState from "./ItemsAndDetails.state";
import { ChangeOrderGridItem, FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from "./ItemsAndDetails.types";

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
  // const parentFormValue = parentFormState?.getFieldValue(name);
  // console.log(parentFormState, parentFormState?.getValues(), parentFormValue, name, autosave, mode);

  const formState = FB.useRef(FBFormState, {});
  // console.log(formState, formState?.getValues());

  console.log(asyncState);

  const { submitForm } = useFormContext();

  const itemsAndDetailsState = FB.useRef<ItemsAndDetailsState>(ItemsAndDetailsState);

  const handleAdd = () => {
    const formValue = formState?.getValues() as FBDocumentRevisionsValue;
    formValue.id = FB.uniqid;

    map(formValue, (value, key) => {
      formState?.omitFieldValue(key);
    });

    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(itemsAndDetailsState.changeOrderItemsList);
    dataToSend.push(formValue);

    submitData(dataToSend);
  };

  const handleRemove = (docRevId: string) => {
    const orderItemsFiltered = itemsAndDetailsState.changeOrderItemsList
      .filter((item: ChangeOrderGridItem) => item.docRevId !== docRevId);
    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(orderItemsFiltered);

    submitData(dataToSend);
  };

  const handleUpdate = () => {
    const { justificationOfChange, descriptionOfChange, proposedDocumentRevision }
      = formState?.getValues() as FBDocumentRevisionsValue;
    const orderItemsUpdated = itemsAndDetailsState.changeOrderItemsList
      .map((item: ChangeOrderGridItem) => {
        if (item.docRevId !== proposedDocumentRevision.id) {
          return item;
        }

        return { ...item, justificationOfChange, descriptionOfChange };
      });

    const dataToSend: FBDocumentRevisionsValue[] =
      storeDataToFormData(orderItemsUpdated);
    console.log(dataToSend);

    submitData(dataToSend);
  };

  const submitData = (dataToSend) => {
    itemsAndDetailsState.setLoadingState(true);
    parentFormState?.setFieldValue(name, cloneDeep(dataToSend), true);
    // Submit the form - and once that returns, add this item to the store
    // itemsAndDetailsState.add(formValue);

    if (autosave) {
      submitForm();
    }
  };

  useEffect(() => {
    if ((asyncState.status === AsyncStatus.Success ||
      asyncState.status === AsyncStatus.Error)) {
      // i.e. processing completed
      console.log("Processing Complete");
      itemsAndDetailsState.setLoadingState(false);
      itemsAndDetailsState.setViewItemActionsVisibility(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncState.status]);

  React.useEffect(() => {
    processChangeRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequest]);

  const processChangeRequest = () => {
    let currentDocRevPresent = false;
    const documentRevisionsData = changeRequest.documentRevisions;

    const documentRevisionsAssigned: FBDocumentRevisionsValue[] = changeRequest.formInput?.documentRevisions ?? [];
    // Happens only when one of the expressAR options is chosen
    if (currentDocRevId) {
      currentDocRevPresent = documentRevisionsAssigned.findIndex(
        (docRev: FBDocumentRevisionsValue) => (docRev.proposedDocumentRevision.id === currentDocRevId)) !== -1;

      console.log(currentDocRevPresent);

      if (!currentDocRevPresent) {
        documentRevisionsAssigned.push(newARDocRevToAdd(currentDocRevId));
      }
    }

    console.log(documentRevisionsAssigned);

    const entries = documentRevisionsAssigned.map((item: FBDocumentRevisionsValue) => {
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

    itemsAndDetailsState.setChangeOrderItemsList(entries);

    // If entries does not have the currentDocRevId, then we add a new entry to the parentFormState and submit data
    console.log(currentDocRevPresent, currentDocRevId);
    // if (!currentDocRevPresent) {
    //   submitData(documentRevisionsAssigned);
    // }
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
