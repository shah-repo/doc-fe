import { Popper } from '@material-ui/core';
import React, { useRef } from 'react';
import Actions, { ActionsProps } from './Actions';
import { EditableVendorData } from '../types';

export const ActionsCell: React.FC<ActionsProps<EditableVendorData> & { rootClassName?: string }> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      <Popper
        open
        placement="bottom-end"
        anchorEl={ref.current}
      >
        <Actions
          scrollBehavior="smooth"
          {...props}
        />
      </Popper>
    </>
  );
};
