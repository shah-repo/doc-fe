import { Box } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../../components/KendoDataGrid/constants';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { EMPTY_DROPDOWN_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { isEditMode } from '../../utils';
import { styles } from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocumentId, lotDocRevId } = dataItem;
  const fieldValue = dataItem[field];

  if (isEditMode(dataItem)) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowingContent
        title={fieldValue}
      >
        {fieldValue && lotDocumentId ? <Link
          to={documentPreviewPath(lotDocRevId, lotDocumentId)}
          target="_blank"
          className={classes.link}
        >
          {fieldValue}
        </Link> : EMPTY_DROPDOWN_PLACEHOLDER}
      </OverflowingContent>
    </Box>
  );
};
