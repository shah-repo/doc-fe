import { useFormikContext } from 'formik';
import React from 'react';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem } from '../types';

export const PartRevCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const { name, displayRevision, document } = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as DocumentRevision;

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  const textToDisplay = () => {
    return `${document.docId}. Rev ${displayRevision} - ${name}`;
  };

  return (
    <OverflowTooltip
      title={textToDisplay()}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
    >
      { textToDisplay() }
    </OverflowTooltip>
  );
};
