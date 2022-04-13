import { createStyles, makeStyles, RadioGroup } from "@material-ui/core";
import React from "react";
import { FBInput, FBRadioGroupProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBRadioGroup } from "./FBRadioGroup.wrap";

const styles = makeStyles(() =>
  createStyles({
    radio: {
      "& .MuiIconButton-colorSecondary": {
        color: Colors.navy,
      },
    },
  }));

const FBRadioGroup: React.FunctionComponent<FBRadioGroupProps> = ({
  controls,
  row = true,
  type = "radiogroup",
  onBlur,
  ...props
}) => {
  const classes = styles();
  return (
    <FBInput {...props} {...{ type }}>
      <RadioGroup {...props} {...{ row  }} className={classes.radio}>
        {controls}
      </RadioGroup>
    </FBInput>
  );
};

export default withFBRadioGroup(FBRadioGroup);
