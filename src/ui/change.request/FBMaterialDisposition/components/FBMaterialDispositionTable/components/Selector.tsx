import { makeStyles } from '@material-ui/core';
import React, { useRef } from 'react';

const useStyles = makeStyles({
  root: {
    marginLeft: '-3px',
    height: '3px',
  },
  selecterBox: {
    minHeight: '32px',
    height: '32px',
    width: '354px',
    border: '2px dashed #4d88ff',
    pointerEvents: 'none',
  },
  selecterHandler: {
    height: '12px',
    width: '12px',
    backgroundColor: '#4d88ff',
    position: 'absolute',
    right: '-4px',
    bottom: '-4px',
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
});

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
