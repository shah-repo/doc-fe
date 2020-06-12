import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBDocumentRevisionsState } from "..";
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
    useObserver(() => docRevState?.documentRevisions);
    return Component({
      ...(props as T),
      dialogState,
      docRevState,
    });
  };

  return (props: T) => Comp(props);
};
