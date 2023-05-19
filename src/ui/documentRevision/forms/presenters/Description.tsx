import * as React from 'react';
import { useIntl } from 'react-intl';
import { SMTextEditor } from '../../../../App';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import useDescription from '../../../hooks/docCustomization/useDescription';

interface Props {
  isQms: boolean;
  documentTypeId?: string;
  isDisabled?: boolean;
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isQms,
  isDisabled = false,
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useDescription(documentTypeId, isQms);
  const placeholder: string = intl.formatMessage({ id: 'form.builder.enter.description' });

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
