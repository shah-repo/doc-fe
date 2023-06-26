import React from 'react';
import { ReactComponent as CloseIcon } from '../../../../assets/images/model_close.svg';
import { StyleTooltip } from './StyleTooltip';

interface Props {
  classes: any
  onClick: () => void
}

const DismissAction: React.FC<Props> = (props) => {
  const { classes, onClick } = props;

  return (
    <span className={classes.actionIcon}>
      <StyleTooltip
        title="Dismiss"
        placement="top"
        arrow
      >
        <CloseIcon
          data-cy="dismiss-icon"
          className={classes.cursorPointer}
          onClick={onClick}
        />
      </StyleTooltip>
    </span>
  );
};

export default DismissAction;
