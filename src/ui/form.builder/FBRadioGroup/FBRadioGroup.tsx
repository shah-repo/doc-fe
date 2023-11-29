import { RadioGroup, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import { FBInput, FBRadioGroupProps } from '..';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBRadioGroup } from './FBRadioGroup.wrap';

const styles = makeStyles(() =>
  createStyles({
    radio: {
      '& .MuiTypography-root': {
        fontSize: '14px',
        fontWeight: 400,
      },
    },
  }));

const FBRadioGroupComp: React.FC<FBRadioGroupProps> = ({
  controls,
  onBlur,
  ...props
}) => {
  const classes = styles();
  return (
    <RadioGroup {...props} className={classes.radio}>
      {controls}
    </RadioGroup>
  );
};

const FBRadioGroupChild = withFBRadioGroup(FBRadioGroupComp);

const FBRadioGroup: React.FC<FBRadioGroupProps> = ({
  controls,
  row = true,
  type = 'radiogroup',
  ...props
}) => {
  return (
    <FBInput {...props} type={type} labelProps={FBFontStyle.labelProps}>
      <FBRadioGroupChild {...props} {...{ row, controls }} />
    </FBInput>
  );
};

export default FBRadioGroup;
