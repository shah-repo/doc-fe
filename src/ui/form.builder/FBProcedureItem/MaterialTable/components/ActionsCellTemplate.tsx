import { makeStyles, Popper } from '@material-ui/core';
import PopperJs from 'popper.js';
import React, { useEffect, useRef, useState } from 'react';
import { ActionsProps, EditableMaterial } from '../types';
import ActionButtons from './ActionButtons';

interface Props extends ActionsProps<EditableMaterial> {
  rootClassName?: string
  popperRef?: React.RefObject<PopperJs>
}

const useStyles = makeStyles({
  popper: {
    zIndex: 1300,
  },
});

export const ActionsCell: React.FC<Props> = ({ popperRef, ...props }) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const [areActionsShowed, setActionsShowed] = useState(false);

  useEffect(() => {
    setActionsShowed(true);
  }, []);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      <Popper
        open={areActionsShowed}
        placement="bottom-end"
        anchorEl={ref.current}
        modifiers={{
          keepTogether: {
            enabled: true,
          },
          preventOverflow: {
            enabled: false,
          },
        }}
        className={classes.popper}
      >
        <ActionButtons
          scrollBehavior="smooth"
          {...props} />
      </Popper>
    </>
  );
};
