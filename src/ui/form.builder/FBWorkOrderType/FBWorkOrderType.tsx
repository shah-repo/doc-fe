import { createStyles, makeStyles, RadioGroup } from '@material-ui/core';
import React, { useState } from 'react';
import { FBInput } from '..';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBWorkOrderTypeProps } from './FBWorkOrderType.types';
import { withFBWorkOrderType } from './FBWorkOrderType.wrap';

const styles = makeStyles(() =>
  createStyles({
    radio: {
      '& .MuiTypography-root': {
        fontSize: '14px',
        fontWeight: 400,
      },
    },
  }),
);

const FBWorkOrderTypeChildComp: React.FC<FBWorkOrderTypeProps> = ({
  controls,
  onBlur,
  confirmationDialog,
  confirmAlertDialog,
  cancelAlertDialog,
  ...props
}) => {
  const classes = styles();
  return (
    <>
      <RadioGroup {...props} className={classes.radio}>
        {controls}
      </RadioGroup>
      {confirmationDialog?.isOpen && (
        <AlertDialog
          dialog={confirmationDialog}
          confirmAction={() => confirmAlertDialog?.()}
          cancelAction={cancelAlertDialog}
          message="form.builder.wo.type.switch.msg"
        />
      )}
    </>
  );
};

const FBWorkOrderTypeChildWithWrap = withFBWorkOrderType(FBWorkOrderTypeChildComp);

const FBWorkOrderType: React.FC<FBWorkOrderTypeProps> = ({
  controls,
  row = true,
  type = 'radiogroup',
  ...props
}) => {
  const [forceRender, setForceRender] = useState(false);
  return (
    <FBInput
      { ...props}
      rules="required"
      validators={{ required: true }}
      type={type}
      labelProps={FBFontStyle.labelProps}
    >
      {forceRender && (
        <FBWorkOrderTypeChildWithWrap
          {...props}
          {...{ row, controls, setForceRender, forceRender }}
        />
      )}
      {!forceRender && (
        <FBWorkOrderTypeChildWithWrap
          {...props}
          {...{ row, controls, setForceRender, forceRender }}
        />
      )}
    </FBInput>
  );
};

export default FBWorkOrderType;
