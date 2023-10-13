import { makeStyles, Popper } from '@material-ui/core';
import React, { useRef } from 'react';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import Actions, { ActionsProps } from '../../../../form.builder/FBApprovalMatrixRoles/components/Actions';

const useStyles = makeStyles({
  popperHolder: {
    height: '100%',
  },
  popper: {
    zIndex: 1400,
  },
});

export const ActionsCellTemplate: React.FC<ActionsProps> = (props) => {
  const { dataItem } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const ref = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  if (!isEditMode) {
    return null;
  }

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
