import { makeStyles } from '@material-ui/core';
import React, { useRef } from 'react';
import { Colors } from '../../../../../layout/theme-next';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(-0.375),
    height: 3,
  },
  selecterBox: {
    minHeight: 32,
    height: 32,
    width: 354,
    border: `2px dashed ${Colors.primaryLight}`,
    pointerEvents: 'none',
  },
  selecterHandler: {
    height: 12,
    width: 12,
    backgroundColor: Colors.primaryLight,
    position: 'absolute',
    right: -4,
    bottom: -4,
    pointerEvents: 'all',
  },
  wrap: {
    position: 'absolute',
    display: 'inline-block',
    zIndex: 10,
    pointerEvents: 'none',
  },
  pointerEventsNone: {
    pointerEvents: 'none',
  },
}));

export const Selector: React.FC = () => {
  const classes = useStyles();
  const selecterHandlerRef = useRef<HTMLDivElement>(null);
  const selecterRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e) => {
    if (selecterRef && selecterHandlerRef.current) {
      selecterHandlerRef.current?.classList.add(classes.pointerEventsNone);

      const mousemove = (e: MouseEvent) => {
        const selecter = selecterRef.current?.getBoundingClientRect();
        const top = selecter?.top ?? 0;
        if (e.clientY > top && selecterRef.current) {
          const newHeight = e.clientY - top;
          selecterRef.current.style.height = `${newHeight}px`;
        }
      };

      const mouseup = (e: MouseEvent) => {
        selecterHandlerRef.current?.classList.remove(classes.pointerEventsNone);
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
      };
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.wrap}>
          <div
            className={classes.selecterBox}
            ref={selecterRef}
          />
          <div
            className={classes.selecterHandler}
            onMouseDown={handleMouseDown}
            ref={selecterHandlerRef}
          />
        </div>
      </div>
    </div>
  );
};
