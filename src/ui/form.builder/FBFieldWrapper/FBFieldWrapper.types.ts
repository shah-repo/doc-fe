import { FBFormProps, FBInputProps } from '..';

export type FBFieldWrapperProps =
  & Pick<FBFormProps, 'children'>
  & {
    mt?: number
    mb?: number
    inputProps?: Partial<FBInputProps>
    showDefaultFieldTools?: boolean
    canUseTools?: boolean
    canAddField?: boolean
    isFirst?: boolean
    isDragging?: boolean
    isMarkDownVisible?: boolean
    toggleItemMarkdown?: () => void
  };

export const LHR_WORK_ORDER = 'lhr-work-order';
