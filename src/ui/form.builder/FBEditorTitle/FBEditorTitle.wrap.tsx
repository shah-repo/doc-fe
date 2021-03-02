import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorTitleProps } from "..";

export const withFBEditorTitle = <T extends FBEditorTitleProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mode,
    ...props
  }: T) => {

    const { editorState, formState } = FB.useStores();

    const handleMode = () => {
      const mode = editorState?.mode === "config" ? "validation" : "config";
      editorState?.setMode(mode);
    };

    useObserver(() => {
      mode = editorState?.mode;
      (mode === "validation") && formState && formState.validate();
    });

    return Component({
      ...(props as T),
      handleMode,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
