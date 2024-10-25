import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { GridHeaderCellProps } from '@progress/kendo-react-grid';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import useStyles from './styles';

interface HeaderCellProps extends GridHeaderCellProps{
  content: string
  isShowIcon?: boolean
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  field,
  content,
  isShowIcon = true,
}) => {
  const translatedContent = translate(content);
  const classes = useStyles();

  return (
    <span className="k-cell-inner">
      <span className="k-link">
        <span className="k-column-title" data-cy={`header-cell-${kebabCase(field)}`} >
          <Box display="flex" alignItems="center">
            {isShowIcon && <Tooltip
              arrow
              placement="top"
              className={classes.headerButton}
              title={translate('administration.general.settings.lcp.not.implemented')}
            >
              <FontAwesomeIcon icon={solid('star-of-life')} />
            </Tooltip>}
            <Tooltip
              arrow
              placement="top"
              className={classes.headerButton}
              title={translatedContent}
            >
              <div className={classes.headerContent}>{translatedContent}</div>
            </Tooltip>
          </Box>
        </span>
      </span>
    </span>
  );
};
