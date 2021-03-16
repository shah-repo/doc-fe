import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFileUploadState, FBFormState } from "..";
import { FBNotesFormProps } from "./FBNotesForm.types";

export const withFBNotesForm = <T extends FBNotesFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    handleNote,
    files,
    ...props
  }: T) => {

    // MARK: @config
    formState = FB.useRef(FBFormState, {});
    const formValue = formState?.getFieldValue("noteFile");
    const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);

    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    handleNote = () => {
      console.log(formState?.getValues());
      formState?.reset();
    };

    // MARK: @observer

    useObserver(() => {
      files = fileUploadState?.files;
    });

    return  Component({
      ...(props as T),
      handleNote,
      formState,
      files,
    });
  };

  Comp.displayName = "withFBNotesForm";
  return Comp;
};
