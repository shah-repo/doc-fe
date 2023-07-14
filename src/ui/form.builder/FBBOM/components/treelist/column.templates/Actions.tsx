import { Popper } from '@material-ui/core';
import PopperJs from 'popper.js';
import React, { useEffect, useRef, useState } from 'react';
import { EditableBOM } from '../../../interface';
import ActionButtons from './ActionsButtons';
import { BOMActionsProps } from './types';

interface Props extends BOMActionsProps<EditableBOM> {
  rootClassName?: string
  popperRef?: React.RefObject<PopperJs>
}

export const ActionsCell: React.FC<Props> = ({ popperRef, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showActions, setActionFlag] = useState(false);

  useEffect(() => {
    setActionFlag(true);
  }, []);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      <Popper
        open={showActions}
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
      >
        <ActionButtons
          scrollBehavior="smooth"
          {...props} />
      </Popper>
    </>
  );
};
