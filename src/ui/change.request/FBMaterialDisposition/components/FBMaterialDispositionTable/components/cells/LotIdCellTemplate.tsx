import { Box } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import { EMPTY_DROPDOWN_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocumentId, lotDocRevId } = dataItem;
  const fieldValue = dataItem[field];

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
