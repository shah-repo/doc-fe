import { Box } from "@material-ui/core";
import { cloneDeep, debounce, filter, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBDialogState, FBDocumentRevisionsActions, FBDocumentRevisionsForm, FBDocumentRevisionsProps, FBDocumentRevisionsState, FBDocumentRevisionsValue, FBFormState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { generateVersionNumber } from "../../documentRevision/helpers";
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
    name = "",
    index = 0,
    ...props
  }: T) => {

    const { formState: parentFormState, bookmarkState } = FB.useStores();
    const parentFormValue = parentFormState?.getFieldValue(name);

    docRevState = FB.useRef(FBDocumentRevisionsState, parentFormValue);
    dialogState = FB.useRef(FBDialogState);
    formState = FB.useRef(FBFormState, {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => debounce(mapCollection, 600), []);

    React.useEffect(() => reaction( // Form sync
      () => docRevState?.value,
      (data) => {
        parentFormState?.setFieldValue(name, cloneDeep(data), true);
        mapCollection();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.documentRevisions),
      () => mapCollection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function mapCollection() {
      const docList = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.documentRevisions);
      if (!docList) {
        bookmarkState?.setLoading(true);
        return;
      }
      docRevState?.value?.map((value, index) => {
        const { proposedDocumentRevision: { id: docRevId } } = value;
        setBookmark(docList.get(docRevId), index);
      });
      bookmarkState?.setLoading(false);
    }

    function setBookmark(documentRevision?: DocumentRevision, at?: number) {
      if (!documentRevision) { return; }
      const { document: { docId }, name: docName } = documentRevision;
      at = (at || 0) + index;
      bookmarkState?.addBookmark({
        name: `fb-docrev-section-${name}-${documentRevision.id}`,
        label: `${docId} - ${docName}`,
      }, at);
    }

    function disabledOptions(): string[] | undefined {
      return map(docRevState?.value, "proposedDocumentRevision.id");
    }

    function getIdBy(index: number): string {
      return parentFormState?.getFieldValue(`${name}.${index}.proposedDocumentRevision.id`);
    }

    const getOptionLabel = (option: DocumentRevision) => {
      const versionNumber = generateVersionNumber(
        option.revision,
        option.revisionStage,
        option.subRevision,
        option.revisionChangeType,
      );
      return `${option.document.docId} rev ${versionNumber} - ${option.name}`;
    };

    // eslint-disable-next-line react/display-name
    const renderOption = (option: DocumentRevision) => (
      <Box display="flex" key={`fb-document-revision-${option.id}`}>
        {getOptionLabel(option)}
      </Box>
    );

    handleForm = () => {
      formState?.reset();
      dialogState?.config({
        open: true,
        title: "form.builder.add.document",
        content: <FBDocumentRevisionsForm
          {...{ formState, getOptionLabel, renderOption }}
          disabledOptions={disabledOptions()}
        />,
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
      index,
      name,
      getOptionLabel,
    });
  };

  Comp.displayName = "withFBDocumentRevisions";
  return Comp;
};
