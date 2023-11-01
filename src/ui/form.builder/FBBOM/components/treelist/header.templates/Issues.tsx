import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import useHover from '../../../../../hooks/useHover';
import { styles } from './styles';

export const Issues: React.FC<TreeListHeaderCellProps> = () => {
  const classes = styles();
  const [issuesContainerRef, isHovered] = useHover<HTMLButtonElement>();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Tooltip
        title={translate('bom.table.title.issues')}
        placement="top"
        arrow
      >
        <span ref={issuesContainerRef} className={classes.iconContainer}>
          <FontAwesomeIcon
            className={classes.icon}
            icon={
              isHovered
                ? solid('hexagon-exclamation')
                : regular('hexagon-exclamation')
            }
          />
        </span>
      </Tooltip>
    </Grid>
  );
};
