import { makeStyles, Popper } from '@material-ui/core';
import React, { useRef } from 'react';
import Actions, { ActionsProps } from '../../../FBApprovalMatrixRoles/components/Actions';

const useStyles = makeStyles({
  popperHolder: {
    height: '100%',
  },
  popper: {
    zIndex: 1400,
  },
});

export const ActionsCell: React.FC<ActionsProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  return (
    <>
      <div ref={ref} className={classes.popperHolder} />
      {ref.current && (
        <Popper
          open
          placement="bottom-end"
          anchorEl={ref.current}
          modifiers={{
            keepTogether: {
              enabled: true,
            },
            preventOverflow: {
              enabled: false,
            },
            hide: {
              enabled: false,
            },
          }}
          className={classes.popper}
        >
          <Actions
            scrollBehavior="smooth"
            {...props}
          />
        </Popper>
      )}
    </>
  );
};
