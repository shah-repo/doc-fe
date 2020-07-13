import React, { useState } from "react";
import { FBAutocompleteAsyncOption } from "../../FBAutocompleteAsync";
import FBAutocompleteAsyncStore from "../../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";

export const withFBProposedDocument = <T extends FBProposedDocumentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleOpen,
    proposedDocumentRevision,
    id,
    ...props
  }: T) => {

    const [isMouseInside, setMouseInside] = useState<boolean>(false);
    const options = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.revision);
    if (options) {
      proposedDocumentRevision = options.get(id);
    }

    handleOpen = () => {
      if (!proposedDocumentRevision) {
        return;
      }
      const { document: { id: documentId = "" } = {}, id: docRevId } = proposedDocumentRevision;
      window.open(`/document_revision/${documentId}/version/${docRevId}`);
    };

    return Component({
      ...(props as T),
      setMouseInside,
      handleOpen,
      isMouseInside,
      id,
    });
  };

  return (props: T) => Comp(props);
};
