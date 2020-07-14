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
    name,
    docRevState,
    dialogState,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    docRevState = FB.useRef<FBDocumentRevisionsState>(FBDocumentRevisionsState, formValue);

    useObserver(() => {
      formState?.setFieldValue(`${name}`, docRevState?.documentRevisions);
    });

    // React.useEffect(() => {
    //   reaction(
    //     () => docRevState?.documentRevisions,
    //     () => formState?.setFieldValue(`${name}`, docRevState?.documentRevisions),
    //   );
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const onClick = () => {
      dialogState?.config({
        open: true,
        title: "Add Document Revision",
        content: (
          <FBForm>
            <FBDocumentRevisionForm />
          </FBForm>
        ),
        actions: <FBDocumentRevisionActions />,
      });
    };

    const removeDocument = (index: number) => {
      docRevState?.removeDocRevItem(index);
    };

    return Component({
      ...(props as T),
      dialogState,
      docRevState,
      onClick,
      removeDocument,
    });
  };

  return (props: T) => Comp(props);
};
