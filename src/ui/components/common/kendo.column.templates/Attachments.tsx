import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  GridColumnMenuWrapper,
  GridHeaderCellProps,
} from '@progress/kendo-react-grid';
import React from 'react';
import Tooltip from '../kendo/Tooltip';
import { styles } from './Attachments.styles';

const Attachments: React.FunctionComponent<GridHeaderCellProps> = ({
  title,
  onClick,
  columnMenuWrapperProps,
}) => {
  const classes = styles();
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
