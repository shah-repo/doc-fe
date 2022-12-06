/* eslint-disable no-console */
import { map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { useFormContext } from "../../components/forms/FormContext";
import { FB, FBFormState } from "../../form.builder";
import { generateDocTitleText } from "./helpers";
import ItemsAndDetails from "./ItemsAndDetails";
import { itemsAndDetailsStore, ItemsAndDetailsStoreContext, useItemsAndDetailsStore } from "./ItemsAndDetails.state";
import { FBDocumentRevisionsValue, ItemsAndDetailsWrapperProps } from "./ItemsAndDetails.types";

const ItemsAndDetailsContainer: React.FunctionComponent<
  ItemsAndDetailsWrapperProps & {name: string}
> = ({
  changeRequest,
  name,
  autosave,
}) => {

  const { formState: parentFormState } = FB.useStores();
  // const parentFormValue = parentFormState?.getFieldValue(name);

  // console.log(parentFormState, parentFormValue, name);

  const formState = FB.useRef(FBFormState, {});

  const { submitForm } = useFormContext();

  const { itemsAndDetailsStore } = useItemsAndDetailsStore();

  // React.useEffect(() => reaction( // Form sync
  //   () => itemsAndDetailsStore?.changeOrderItemsList,
  //   (data) => {
  //       parentFormState?.setFieldValue(name, cloneDeep(data), true);
  //       if (!workspaceState?.autosave) {
  //         return;
  //       }

  //       submitForm();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // ), []);

  const handleAdd = () => {
    const formValue = formState?.getValues() as FBDocumentRevisionsValue;
    console.log(formValue);

    // Submit the form - and once that returns, add this item to the store
    // itemsAndDetailsStore.add(formValue);

    map(formValue, (value, key) => {
      formState?.omitFieldValue(key);
    });

    // submitForm();
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
}) => (
  <ItemsAndDetailsStoreContext.Provider value={itemsAndDetailsStore}>
    <ItemsAndDetailsContainer
      changeRequest={changeRequest}
      name="documentRevisions"
      autosave={autosave}
      initialValues={initialValues}
    />
  </ItemsAndDetailsStoreContext.Provider>
);

export default ItemsAndDetailsWrapper;
