import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import useStyles from './styles';

interface HeaderCellProps extends GridHeaderCellProps{
  content: string
  isShowIcon?: boolean
  isExapandAll?: boolean
  isTooltipHidden?: boolean
  toggleExpandCollapseAll?: (toggle: boolean) => void
}

export const CustomHeaderTooltipCell: React.FC<HeaderCellProps> = ({
  field,
  content,
  isShowIcon,
  isExapandAll,
  isTooltipHidden,
  toggleExpandCollapseAll,
}) => {
  const translatedContent = translate(content);
  const classes = useStyles();

  return (
    <Tooltip title={isTooltipHidden ? '' : translatedContent} placement="top-start" arrow>
      <span className="k-cell-inner">
        <span className="k-link">
          <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`} >
            {isShowIcon && <Tooltip title={translate(isExapandAll ? 'common.collapse.all' : 'common.expand.all')} placement="top" arrow>
              <FontAwesomeIcon
                data-cy="minimize-row-button"
                icon={isExapandAll ? regular('square-minus') : solid('square-plus')}
                className={cx(classes.expand, classes.expandAll)}
                onClick={() => toggleExpandCollapseAll?.(!isExapandAll)}
              />
            </Tooltip>}
            {translatedContent}
          </span>
        </span>
      </span>
    </Tooltip>
  );
};
