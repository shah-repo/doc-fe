import { useObserver } from "mobx-react";
import React from "react";
import { BlockTypeField, FB, FBFieldWrapperProps, FBFieldWrapperState } from "..";

export const withFBFieldWrapper = <T extends FBFieldWrapperProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fieldWrapperState,
    toolsVisible,
    addToolVisible,
    markDownVisible,
    isDragged,
    inputProps,
    position,
    ...props
  }: T) => {

    const { workspaceState, sortableState } = FB.useStores();
    const { designDisabled = false, index, type } = inputProps || {};
    const reviseDisabled = inputProps?.editorProperties?.includes("reviseDisabled");
    fieldWrapperState = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);

    const onMouseOver = () => {
      if (sortableState?.isDragPerfomed) {
        return;
      }
      fieldWrapperState?.setAddToolActive(true);
      if (designDisabled || (reviseDisabled && workspaceState?.isRevised)) { return; }
      fieldWrapperState?.setToolsActive(true);
    };
    const onMouseLeave = () => {
      fieldWrapperState?.setAddToolActive(false);
      if (sortableState?.isDragPerfomed) {
        return;
      }
      fieldWrapperState?.setToolsActive(false);
    };

    useObserver(() => {
      toolsVisible = fieldWrapperState?.toolsVisible;
      addToolVisible = fieldWrapperState?.addToolVisible;
      markDownVisible = fieldWrapperState?.markDownVisible;
      isDragged = index === sortableState?.draggedIndex;
    });

    const isSection = type === "section" || type === "subsection";
    const isBlock = type && BlockTypeField.includes(type);
    const isFirst = position === 1;
    const mt = isFirst || isDragged ? 0 : isBlock ? 6 : 3.5;
    const mb = isSection ? -0.5 : 2;

    return useObserver(() => Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      fieldWrapperState,
      toolsVisible,
      addToolVisible,
      markDownVisible,
      designDisabled,
      inputProps,
      index,
      type,
      isDragged,
      mt,
      mb,
    }));
  };

  return (props: T) => Comp(props);
};
