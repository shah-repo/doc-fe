import { cloneDeep, filter, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBDialogState, FBDocumentRevisionsActions, FBDocumentRevisionsForm, FBDocumentRevisionsProps, FBDocumentRevisionsState, FBDocumentRevisionsValue, FBFormState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBDocumentRevisions = <T extends FBDocumentRevisionsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    handleForm,
    handleAdd,
    handleCancel,
    handleOpen,
    remove,
    docRevState,
    dialogState,
    formState,
    collection,
    name,
    ...props
  }: T) => {

    const { formState: parentFormState } = FB.useStores();
    const parentFormValue = parentFormState?.getFieldValue(name);

    docRevState = FB.useRef(FBDocumentRevisionsState, parentFormValue);
    dialogState = FB.useRef(FBDialogState);
    formState = FB.useRef(FBFormState, {});

    React.useEffect(() => reaction( // Form sync
      () => docRevState?.value,
      (data) => parentFormState?.setFieldValue(name, cloneDeep(data))
    ), []);

    function disabledOptions(): string[] | undefined {
      return map(docRevState?.value, "proposedDocumentRevision.id");
    }

    function getIdBy(index: number): string {
      return parentFormState?.getFieldValue(`${name}.${index}.proposedDocumentRevision.id`);
    }

    handleForm = () => {
      formState?.reset();
      dialogState?.config({
        open: true,
        title: "form.builder.add.document",
        content: <FBDocumentRevisionsForm {...{ formState }} disabledOptions={disabledOptions()} />,
        actions: <FBDocumentRevisionsActions {...{ handleAdd, handleCancel }} />,
      });
    };

    handleAdd = () => {
      const formValue = formState?.getValues() as FBDocumentRevisionsValue;
      docRevState?.addDocumentRevision(formValue);
      handleCancel?.();
    };

    handleOpen = (index: number) => {
      const rec = FBAutocompleteAsyncStore.getValue<DocumentRevision>(
        FBAutocompleteAsyncOption.documentRevisions,
        getIdBy(index),
      );
      if (!rec) { return; }
      const { document: { id: documentId = "" } = {}, id: docRevId } = rec;
      window.open(`/document_revision/${documentId}/version/${docRevId}`);
    };

    remove = (index: number) => {
      const id: string = getIdBy(index);
      const value = filter(docRevState?.value, (v) => v.proposedDocumentRevision.id !== id);
      docRevState?.setDocumentRevisions(value);
    };

    handleCancel = () => dialogState?.closeDialog();

    useObserver(() => {
      collection = docRevState?.value;
    });

    return Component({
      ...(props as T),
      handleForm,
      handleOpen,
      remove,
      dialogState,
      collection,
      name,
    });
  };

  Comp.displayName = "withFBDocumentRevisions";
  return Comp;
};
