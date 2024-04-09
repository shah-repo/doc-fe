import { Tooltip } from '@material-ui/core';
import { lowerCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../common/intl';

interface HeaderCellProps {
  title: string
  content: string
}

export const CustomHeaderTooltipCell: React.FC<HeaderCellProps> = ({
  title,
  content,
}) => {
  const translatedTitle = translate(title);
  const translatedContent = translate(content);
  const dataCy = lowerCase(translatedContent).replaceAll(' ', '-');

  return (
    <Tooltip title={translatedTitle} placement="top-start" arrow>
      <span className="k-cell-inner">
        <span className="k-link">
          <span className="k-column-title" data-cy={dataCy}>
            {translatedContent}
          </span>
        </span>
      </span>
    </Tooltip>
  );
};
