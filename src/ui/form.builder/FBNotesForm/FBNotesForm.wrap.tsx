import React from "react";
import { FB, FBFormState, FBNotesFormProps } from "..";

export const withFBNotesForm = <T extends FBNotesFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    handleNote,
    ...props
  }: T) => {

    // MARK: @config
    formState = FB.useRef(FBFormState, {});


    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    handleNote = () => {
      console.log(formState?.getValues());
    };

    // MARK: @observer

    return  Component({
      ...(props as T),
      handleNote,
      formState,
    });
  };

  Comp.displayName = "withFBNotesForm";
  return Comp;
};
