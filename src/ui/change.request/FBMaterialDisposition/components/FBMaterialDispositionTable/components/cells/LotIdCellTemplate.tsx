import { Box } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import { EMPTY_DROPDOWN_PLACEHOLDER, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocumentId, lotDocRevId } = dataItem;
  const fieldValue = dataItem[field];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return (<span>{EMPTY_VALUE_PLACEHOLDER}</span>);
  }

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip
        title={fieldValue}
        placement="top"
        interactive
        arrow
      >
        {fieldValue && lotDocumentId ? <Link
          to={documentPreviewPath(lotDocRevId, lotDocumentId)}
          target="_blank"
          className={classes.link}
        >
          {fieldValue}
        </Link> : EMPTY_DROPDOWN_PLACEHOLDER}
      </OverflowTooltip>
    </Box>
  );
};
