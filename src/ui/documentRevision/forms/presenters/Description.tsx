import * as React from 'react';
import { SMTextEditor } from '../../../../App';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import useDescription from '../../../hooks/docCustomization/useDescription';

interface Props {
  isQms: boolean
  documentTypeId?: string
  isDisabled?: boolean
  placeholder?: string
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isQms,
  isDisabled = false,
  placeholder,
}) => {
  const { isVisible, label, tooltipConfig } = useDescription(documentTypeId, isQms);

  if (!isVisible) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <SMTextEditor
        name="description"
        {...{ label, placeholder }}
        disabled={isDisabled}
      />
    </CustomLabelTooltip>
  );
};

export default React.memo(Description);
