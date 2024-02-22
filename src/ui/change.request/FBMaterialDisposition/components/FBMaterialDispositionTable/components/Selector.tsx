import { makeStyles } from '@material-ui/core';
import React, { useRef } from 'react';
import { Colors } from '../../../../../layout/theme-next';
import { SELECTER_MARGIN_BOTTOM, SELECTER_MARGIN_TOP } from '../constants';

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

interface Props {
  containerRef: HTMLDivElement|null
}

export const Selector: React.FC<Props> = ({ containerRef }) => {
  const classes = useStyles();
  const selecterHandlerRef = useRef<HTMLDivElement>(null);
  const selecterRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e) => {
    if (!(selecterRef && selecterHandlerRef.current && rootRef.current && wrapperRef)) {
      return;
    }

    selecterHandlerRef.current?.classList.add(classes.pointerEventsNone);
    const rowsContainer = containerRef?.querySelector('tbody');
    const rowsContainerClientRect = rowsContainer?.getBoundingClientRect();
    const rowsContainerBottom = rowsContainerClientRect?.bottom ?? 0;
    const rowsContainerTop = rowsContainerClientRect?.top ?? 0;
    const rootElemRect = rootRef.current?.getBoundingClientRect();
    const rootTop = rootElemRect?.top ?? 0;
    const selecter = selecterRef.current?.getBoundingClientRect();
    const selecterTop = selecter?.top ?? 0;
    const selecterBottom = selecter?.bottom ?? 0;

    const mousemove = (e: MouseEvent) => {
      if (e.clientY > rootTop && e.clientY < (rowsContainerBottom - SELECTER_MARGIN_BOTTOM) && selecterRef.current && selecterHandlerRef.current && wrapperRef.current) {
        const newHeight = e.clientY - rootTop;
        selecterRef.current.style.height = `${newHeight}px`;
        selecterHandlerRef.current.style.top = `${e.clientY - rootTop}px`;
        wrapperRef.current.style.top = `${selecterTop - rowsContainerTop}px`;
        wrapperRef.current.style.bottom = `${e.clientY - rootTop + 96}px`;
      } else if (e.clientY < rootTop && e.clientY > (rowsContainerTop + SELECTER_MARGIN_TOP) && wrapperRef.current && selecterRef.current) {
        const difference = e.clientY - rowsContainerTop;
        wrapperRef.current.style.top = `${difference}px`;
        selecterRef.current.style.height = `${100}%`;
        wrapperRef.current.style.bottom = `${rowsContainerBottom - selecterBottom}px`;
      }
    };

    const mouseup = (e: MouseEvent) => {
      selecterHandlerRef.current?.classList.remove(classes.pointerEventsNone);

      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  };

  return (
    <div>
      <div className={classes.root} ref={rootRef}>
        <div className={classes.wrap} ref={wrapperRef}>
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
