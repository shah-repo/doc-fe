import { Box } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import { EMPTY_DROPDOWN_PLACEHOLDER, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { isEditMode } from '../../utils';
import { styles } from './styles';

export const getEmptyPlaceholderJSX: React.FC = () => (<span>{EMPTY_VALUE_PLACEHOLDER}</span>);

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocumentId, lotDocRevId } = dataItem;
  const fieldValue = dataItem[field];

  if (isEditMode(dataItem)) {
    return getEmptyPlaceholderJSX({});
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
