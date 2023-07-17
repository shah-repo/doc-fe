import { Popper } from '@material-ui/core';
import PopperJs from 'popper.js';
import React, { useRef } from 'react';
import Actions, { ActionsProps } from '../../FBApprovalMatrixRoles/components/Actions';
import { EditableLotTransfer } from '../types';

interface Props extends ActionsProps<EditableLotTransfer> {
  rootClassName?: string
  popperRef?: React.RefObject<PopperJs>
}

export const ActionsCell: React.FC<Props> = ({ popperRef, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
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
        >
          <Actions
            scrollBehavior="smooth"
            {...props} />
        </Popper>
      )}
    </>
  );
};
