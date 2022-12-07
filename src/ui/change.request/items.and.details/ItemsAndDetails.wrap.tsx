/* eslint-disable no-console */
import { cloneDeep, map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { useFormContext } from "../../components/forms/FormContext";
import { FB, FBForm, FBFormState } from "../../form.builder";
import { generateDocTitleText } from "./helpers";
import ItemsAndDetails from "./ItemsAndDetails";
import { itemsAndDetailsStore, ItemsAndDetailsStoreContext, useItemsAndDetailsStore } from "./ItemsAndDetails.state";
import { ChangeOrderGridItem, FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from "./ItemsAndDetails.types";

const ItemsAndDetailsContainer: React.FunctionComponent<
  ItemsAndDetailsWrapperProps & {name: string}
> = ({
  changeRequest,
  name,
  autosave,
  mode,
}) => {

  const { formState: parentFormState } = FB.useStores();
  const parentFormValue = parentFormState?.getFieldValue(name);

  console.log(parentFormState, parentFormState?.getValues(), parentFormValue, name, autosave, mode);

  const formState = FB.useRef(FBFormState, {});
  console.log(formState, formState?.getValues());

  const { submitForm } = useFormContext();

  const { itemsAndDetailsStore } = useItemsAndDetailsStore();

  const handleAdd = () => {
    const formValue = formState?.getValues() as FBDocumentRevisionsValue;
    formValue.id = FB.uniqid;

    const dataToSend: FBDocumentRevisionsValue[] =
      itemsAndDetailsStore.changeOrderItemsList.map((item: ChangeOrderGridItem) => (
        {
          justificationOfChange: item.justificationOfChange,
          descriptionOfChange: item.descriptionOfChange,
          id: item.id,
          proposedDocumentRevision: {
            id: item.docRevId,
          },
        }
      ));
    dataToSend.push(formValue);

    parentFormState?.setFieldValue(name, cloneDeep(dataToSend), true);
    // Submit the form - and once that returns, add this item to the store
    // itemsAndDetailsStore.add(formValue);

    map(formValue, (value, key) => {
      formState?.omitFieldValue(key);
    });

    if (autosave) {
      submitForm();
    }
  };

  React.useEffect(() => {
    processChangeRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequest]);

  const processChangeRequest = () => {
    const documentRevisionsData = changeRequest.documentRevisions;

    const documentRevisiosnAssigned = changeRequest.formInput?.documentRevisions ?? [];
    const entries = documentRevisiosnAssigned.map((item: FBDocumentRevisionsValue) => {
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
      const { displayRevision, name, document } =
        documentRevisionsData.find((docRev: DocumentRevision) => docRev.id === docRevId);
      if (document) {
        entryInfo.titleText = generateDocTitleText(document.docId, displayRevision, name);
        entryInfo.isPart = document.documentType.group === DOC_TYPE_GROUP.PART;
        entryInfo.documentId = document.id;
        entryInfo.displayRevision = displayRevision;
      }

      return entryInfo;
    });

    itemsAndDetailsStore.setChangeOrderItemsList(entries);
  };

  return useObserver(() => (
    <ItemsAndDetails
      formState = {formState}
      handleAdd = {handleAdd}
    />
  ));

};


const ItemsAndDetailsWrapper: React.FunctionComponent<ItemsAndDetailsWrapperProps> = ({
  changeRequest,
  initialValues,
  autosave,
  mode,
}) => (
  <ItemsAndDetailsStoreContext.Provider value={itemsAndDetailsStore}>
    <FBForm {...{ initialValues }}>
      <ItemsAndDetailsContainer
        changeRequest={changeRequest}
        name="documentRevisions"
        autosave={autosave}
        initialValues={initialValues}
        mode={mode}
      />
    </FBForm>
  </ItemsAndDetailsStoreContext.Provider>

);

export default ItemsAndDetailsWrapper;
