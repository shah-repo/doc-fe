import * as React from 'react';
import { useIntl } from 'react-intl';
import { SMTextEditor } from '../../../../App';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import useDescription from '../../../hooks/docCustomization/useDescription';
import { checkIsDocumentSupplier } from '../../helpers/checkDocumentGroup';

interface Props {
  isQms: boolean
  documentTypeId?: string
  isDisabled?: boolean
  documentRevision?: DocumentRevision
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isQms,
  isDisabled = false,
  documentRevision,
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useDescription(documentTypeId, isQms);
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isSupplier = checkIsDocumentSupplier(groupOptions);
  const placeholder: string = intl.formatMessage({ id: isSupplier ? 'form.builder.supplier.enter.description' : 'form.builder.enter.description' });

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
