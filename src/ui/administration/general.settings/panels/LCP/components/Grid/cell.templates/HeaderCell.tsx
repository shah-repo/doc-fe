import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';

interface HeaderCellProps extends GridHeaderCellProps{
  content: string
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  field,
  content,
}) => {
  const translatedContent = translate(content);

  return (
    <span className="k-cell-inner">
      <span className="k-link">
        <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`} >
          <Tooltip
            arrow
            placement="top"
            style={{ marginRight: '5px' }}
            title={translate('administration.general.settings.lcp.not.implemented')}
          >
            <FontAwesomeIcon icon={solid('star-of-life')} />
          </Tooltip>
          {translatedContent}
        </span>
      </span>
    </span>
  );
};
