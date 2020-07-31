import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBDocumentRevisionsState, FBForm } from "..";
import FBDocumentRevisionActions from "./FBDocumentRevisionActions/FBDocumentRevisionActions";
import FBDocumentRevisionForm from "./FBDocumentRevisionForm/FBDocumentRevisionForm";
import { FBDocumentRevisionProps } from "./FBDocumentRevisions.types";

export const withFBDocumentRevisions = <T extends FBDocumentRevisionProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    docRevState,
    dialogState,
    documentRevisions,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    docRevState = FB.useRef<FBDocumentRevisionsState>(FBDocumentRevisionsState, formValue);

    useObserver(() => {
      documentRevisions = docRevState?.documentRevisions;
      formState?.setFieldValue(name, documentRevisions);
    });

    handleAdd = () => {
      dialogState?.config({
        open: true,
        title: "changeRequest.documentControl.addDocument",
        content: (
          <FBForm>
            <FBDocumentRevisionForm />
          </FBForm>
        ),
        actions: <FBDocumentRevisionActions />,
      });
    };

    return Component({
      ...(props as T),
      handleAdd,
      dialogState,
      docRevState,
      documentRevisions,
    });
  };

  return (props: T) => Comp(props);
};
