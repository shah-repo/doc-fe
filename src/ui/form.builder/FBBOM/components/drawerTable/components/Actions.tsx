import { Popper } from '@material-ui/core';
import PopperJs from 'popper.js';
import React, { useEffect, useRef, useState } from 'react';
import { EditableAlternatePart } from '../../treelist/interface';
import Actions, { ActionsProps } from './ActionsCell';

interface Props extends ActionsProps<EditableAlternatePart> {
  rootClassName?: string
  popperRef?: React.RefObject<PopperJs>
}

export const ActionsCell: React.FC<Props> = ({ popperRef, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [areActionsShowed, setActionsShowed] = useState(false);

  useEffect(() => {
    setActionsShowed(true);
  }, []);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      {ref.current && (
        <Popper
          open={areActionsShowed && !props.isDisabled}
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
          style={{ zIndex: 1325 }}
        >
          <Actions
            scrollBehavior="smooth"
            {...props} />
        </Popper>
      )}
    </>
  );
};
