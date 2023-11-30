import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '../../../../../../components/common/kendo/Tooltip';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { lotDocId, lotDocRevId } = dataItem;
  console.log('DataItem ::', dataItem);
  const fieldValue = dataItem[field];

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && <Tooltip
        data={fieldValue}
        childrenElement={
          <Link
            to={documentPreviewPath(lotDocRevId, '0706db03-1b97-4195-874d-1edcf60876b8' ?? lotDocId)}
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
