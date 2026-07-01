import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { useStyles } from '../styles';

interface HeaderCellProps extends GridHeaderCellProps {
  content: string
  tooltipTitle?: string
  shouldShowNotImplementedIcon?: boolean
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  field,
  content,
  tooltipTitle,
  shouldShowNotImplementedIcon,
}) => {
  const classes = useStyles();
  const translatedContent = translate(content);
  const translatedTooltipTitle = tooltipTitle ? translate(tooltipTitle) : translatedContent;

  return (
    <Box display="flex" alignItems="center">
      {shouldShowNotImplementedIcon && <Tooltip
        arrow
        placement="top"
        className={classes.headerButton}
        title={translate('administration.general.settings.lcp.not.implemented')}
      >
        <FontAwesomeIcon icon={solid('star-of-life')} />
      </Tooltip>}
      <Tooltip classes={{ popper: classes.tooltipContent }} title={translatedTooltipTitle} placement="top-start" arrow>
        <span className={`k-cell-inner ${classes.header}`}>
          <span className="k-link">
            <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`}>
              {translatedContent}
            </span>
          </span>
        </span>
      </Tooltip>
    </Box>
  );
};
