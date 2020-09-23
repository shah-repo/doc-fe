import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBTextEditorOptionsProps, FBTextEditorOptionsState } from "..";

/*
  This comp imitates select box for FBTextEditor predefined options for editor
  value selection to preserve editor's focus and prevent it from masking.
*/
export const withFBTextEditorOptions = <T extends FBTextEditorOptionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleButtonClick,
    textEditorOptionsState,
    menuAnchorElement,
    menuVisible,
    ...props
  }: T) => {

    // MARK: @config
    const { textEditorState } = FB.useStores();
    textEditorOptionsState = FB.useRef(FBTextEditorOptionsState);

    // MARK: @helpers
    const onOptionsChange = (value: string) => {
      textEditorOptionsState?.setAnchorElement(undefined);
      textEditorOptionsState?.setMenuVisible(false);
      setTimeout(() => {
        props.onOptionsChange?.(value);
        textEditorState?.setPreserveFocus(false);
      }, 100);
    };

    // MARK: @methods
    handleButtonClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      textEditorOptionsState?.setAnchorElement(ev.currentTarget);
      textEditorState?.setPreserveFocus(true);
      textEditorOptionsState?.setMenuVisible(true);
    };

    // MARK: @observer
    useObserver(() => {
      menuVisible = textEditorOptionsState?.menuVisible;
      menuAnchorElement = textEditorOptionsState?.menuAnchorElement;
    });

    return Component({
      ...(props as T),
      onOptionsChange,
      handleButtonClick,
      menuAnchorElement,
      menuVisible,
    });
  };

  Comp.displayName = "withFBTextEditorOptions";
  return Comp;
};
