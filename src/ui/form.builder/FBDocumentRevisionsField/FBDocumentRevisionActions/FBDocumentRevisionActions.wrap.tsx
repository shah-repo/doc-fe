import React from "react";
import { FBDocumentRevisionActionsProps } from ".";
import { FB } from "../..";
import { FBDocumentRevisionItem } from "../FBDocumentRevisions.types";

export const withFBDocumentRevisionActions = <T extends FBDocumentRevisionActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    handleCancel,
    ...props
  }: T) => {

    const { docRevState, dialogState, formState } = FB.useStores();

    handleAdd = () => {
      const formValues = formState?.getValues();
      docRevState?.addDocRevItem(formValues as FBDocumentRevisionItem);
      dialogState?.closeDialog();
    };

    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
    });
  };

  return (props: T) => Comp(props);
};
