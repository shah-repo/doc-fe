import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  GridColumnMenuWrapper,
  GridHeaderCellProps,
} from '@progress/kendo-react-grid';
import React from 'react';
import Tooltip from '../kendo/Tooltip';
import useStyles from './Attachments.styles';

const Attachments: React.FC<GridHeaderCellProps> = ({
  title,
  onClick,
  columnMenuWrapperProps,
}) => {
  const classes = useStyles();
  return (
    <>
      {title && (
        <Tooltip
          placement="top"
          data={title}
          showTooltip
          childrenElement={
            <span className="k-link" onClick={onClick}>
              <FontAwesomeIcon
                icon={solid('paperclip')}
                className={classes.icon}
              />
            </span>
          }
        />
      )}

      {columnMenuWrapperProps.columnMenu && (
        <GridColumnMenuWrapper {...columnMenuWrapperProps} />
      )}
    </>
  );
};

export default Attachments;
