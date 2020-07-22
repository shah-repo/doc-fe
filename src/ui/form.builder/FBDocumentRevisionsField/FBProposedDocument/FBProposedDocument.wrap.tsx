import _ from "lodash";
import React, { useState } from "react";
import { FB } from "../..";
import { FBAutocompleteAsyncOption } from "../../FBAutocompleteAsync";
import FBAutocompleteAsyncStore from "../../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";

export const withFBProposedDocument = <T extends FBProposedDocumentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleOpen,
    proposedDocumentRevision,
    disabled,
    handleEdit,
    id,
    ...props
  }: T) => {

    const { docRevState } = FB.useStores();
    const [isMouseInside, setMouseInside] = useState<boolean>(false);

    handleEdit = (e: React.ChangeEvent<any>, index: number, type: string) => {
      const value = _.get(e.target, "value");
      docRevState?.editTextFields(value, index, type);
    };

    handleOpen = () => {
      const options = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.documentRevisions);
      if (options) {
        proposedDocumentRevision = options.get(id);
      }
      if (!proposedDocumentRevision) {
        return;
      }
      const { document: { id: documentId = "" } = {}, id: docRevId } = proposedDocumentRevision;
      window.open(`/document_revision/${documentId}/version/${docRevId}`);
    };

    const removeDocument = (id: string) => {
      docRevState?.removeDocRevItem(id);
    };

    return Component({
      ...(props as T),
      setMouseInside,
      handleOpen,
      removeDocument,
      isMouseInside,
      disabled,
      handleEdit,
      id,
    });
  };

  return (props: T) => Comp(props);
};
