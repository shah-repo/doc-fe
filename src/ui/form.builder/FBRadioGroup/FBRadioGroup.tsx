import { createStyles, makeStyles, RadioGroup } from "@material-ui/core";
import React from "react";
import { FBInput, FBRadioGroupProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBRadioGroup } from "./FBRadioGroup.wrap";

const styles = makeStyles(() =>
  createStyles({
    radio: {
      "& .MuiIconButton-colorSecondary": {
        color: Colors.navy,
      },
      "& .MuiTypography-root": {
        fontSize: "14px",
        fontWeight: 400,
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
    <FBInput {...props} {...{ type }} labelProps={FBFontStyle.labelProps}>
      <RadioGroup {...props} {...{ row  }} className={classes.radio}>
        {controls}
      </RadioGroup>
    </FBInput>
  );
};

export default withFBRadioGroup(FBRadioGroup);
