import { Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../common/intl';

interface HeaderCellProps extends GridHeaderCellProps{
  content: string
}

export const CustomHeaderTooltipCell: React.FC<HeaderCellProps> = ({
  field,
  title,
  content,
}) => {
  const translatedTitle = translate(title);
  const translatedContent = translate(content);

  return (
    <Tooltip title={translatedTitle} placement="top-start" arrow>
      <span className="k-cell-inner">
        <span className="k-link">
          <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`} >
            {translatedContent}
          </span>
        </span>
      </span>
    </Tooltip>
  );
};
