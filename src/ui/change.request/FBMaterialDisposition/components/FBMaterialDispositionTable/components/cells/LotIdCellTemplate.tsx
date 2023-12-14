import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '../../../../../../components/common/kendo/Tooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { EMPTY_DROPDOWN_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocumentId, lotDocRevId } = dataItem;
  const fieldValue = dataItem[field];

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && lotDocumentId ? <Tooltip
        data={fieldValue}
        childrenElement={
          <Link
            to={documentPreviewPath(lotDocRevId, lotDocumentId)}
            target="_blank"
            className={classes.link}
          >
            {fieldValue}
          </Link>
        }
      /> : EMPTY_DROPDOWN_PLACEHOLDER}
    </OverflowingContent>
  );
};
