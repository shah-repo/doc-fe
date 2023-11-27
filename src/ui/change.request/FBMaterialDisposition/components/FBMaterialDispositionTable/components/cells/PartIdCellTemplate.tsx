import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '../../../../../../components/common/kendo/Tooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const PartIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { partDocId, partDocRevId } = dataItem;
  const fieldValue = dataItem[field];

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && <Tooltip
        data={fieldValue}
        childrenElement={
          <Link
            to={documentPreviewPath(partDocRevId, partDocId)}
            target="_blank"
            className={classes.link}
          >
            {fieldValue}
          </Link>
        }
      />}
    </OverflowingContent>
  );
};
