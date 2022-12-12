import { useObserver } from "mobx-react";
import React from "react";
import { BlockTypeField, FB, FBFieldWrapperProps, FBFieldWrapperState } from "..";
import { checkIsDocumentEquipment } from "../../documentRevision/helpers/checkDocumentGroup";

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
    showSchemaFields = true,
    ...props
  }: T) => {
    const { workspaceState, sortableState } = FB.useStores();
    const { designDisabled = false, index, type } = inputProps || {};
    const reviseDisabled = inputProps?.editorProperties?.includes("reviseDisabled");
    fieldWrapperState = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);
    const isEquipmentDoc = checkIsDocumentEquipment(workspaceState?.document?.document?.documentType?.groupOptions);

    const isInputFromDefaultSchema = workspaceState?.document?.formDocument?.formTemplate?.schema.find(
      (schemaElement) => schemaElement.name === inputProps?.name
    );

    const shouldHideTools =
      sortableState?.isDragPerfomed
      || designDisabled
      || (!showSchemaFields && isInputFromDefaultSchema)
      || (reviseDisabled && workspaceState?.isRevised);

    const shouldHideAddButton = isEquipmentDoc;

    const onMouseOver = () => {
      if (shouldHideTools) {
        return;
      }
      if (!shouldHideAddButton) {
        fieldWrapperState?.setAddToolActive(true);
      }
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
