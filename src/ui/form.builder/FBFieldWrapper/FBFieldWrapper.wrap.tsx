import React, { useCallback } from 'react';
import { BlockTypeField, FB, FBFieldWrapperProps, SectionTypeField } from '..';
import { checkIsDocumentEquipment } from '../../documentRevision/helpers/checkDocumentGroup';

const DEFAULT_MARGIN_TOP = 3.5;
const BLOCK_MARGIN_TOP = 6;
const DEFAULT_MARGIN_BOTTOM = 2;
const SECTION_MARGIN_BOTTOM = -0.5;

export const withFBFieldWrapper = <T extends FBFieldWrapperProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    inputProps,
    isFirst,
    showDefaultFieldTools = true,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const { designDisabled = false, index, type } = inputProps ?? {};
    const [isMarkDownVisible, setIsMarkdownVisible] = React.useState(false);

    const toggleItemMarkdown = useCallback(() => {
      setIsMarkdownVisible(prev => !prev);
    }, []);

    const reviseDisabled = inputProps?.editorProperties?.includes('reviseDisabled') ?? false;
    const isEquipmentDoc = checkIsDocumentEquipment(workspaceState?.document?.document?.documentType?.groupOptions);

    const isInputFromDefaultSchema = workspaceState?.document?.formDocument?.formTemplate?.schema.find(
      (schemaElement) => schemaElement.name === inputProps?.name,
    );

    const isRevised = workspaceState?.isRevised ?? false;
    const canUseTools = !(designDisabled || (reviseDisabled && isRevised) || (!showDefaultFieldTools && isInputFromDefaultSchema));
    const canAddField = !isEquipmentDoc;

    const isSection = type && SectionTypeField.includes(type);
    const isBlock = type && BlockTypeField.includes(type);
    const fieldMarginTop = isBlock ? BLOCK_MARGIN_TOP : DEFAULT_MARGIN_TOP;
    const mt = isFirst ? 0 : fieldMarginTop;
    const mb = isSection ? SECTION_MARGIN_BOTTOM : DEFAULT_MARGIN_BOTTOM;

    return Component({
      ...(props as T),
      toggleItemMarkdown,
      isMarkDownVisible,
      canUseTools,
      canAddField,
      designDisabled,
      inputProps,
      index,
      type,
      mt,
      mb,
    });
  };

  return (props: T) => Comp(props);
};
