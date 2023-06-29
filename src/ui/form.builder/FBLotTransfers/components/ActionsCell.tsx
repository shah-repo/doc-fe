import { Popper } from '@material-ui/core';
import PopperJs from 'popper.js';
import React, { useEffect } from 'react';
import useResizeObserver from '../../../hooks/useResizeObserver';
import Actions, { ActionsProps } from '../../FBApprovalMatrixRoles/components/Actions';
import { EditableLotTransfer } from '../types';

interface Props extends ActionsProps<EditableLotTransfer> {
  rootClassName?: string
  popperRef?: React.RefObject<PopperJs>
}

export const ActionsCell: React.FC<Props> = ({ popperRef, ...props }) => {
  const [ref, size] = useResizeObserver<HTMLDivElement>();
  const popperFinalRef = popperRef ?? React.useRef<PopperJs>(null);

  useEffect(() => {
    popperFinalRef.current?.scheduleUpdate();
  }, [size, popperFinalRef]);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      <Popper
        open
        placement="bottom-end"
        anchorEl={ref.current}
        popperRef={popperFinalRef}
        modifiers={{
          preventOverflow: {
            enabled: false,
          },
        }}
      >
        <Actions
          scrollBehavior="smooth"
          {...props} />
      </Popper>
    </>
  );
};
