import { createStyles, makeStyles } from "@material-ui/core";
import * as React from "react";
import InputField from "../../../components/forms/fields/Input";

interface Props {
  isDisabled: boolean;
}

const styles = makeStyles(() =>
  createStyles({
    textbox: {
      "&.MuiInputBase-root": {
        padding: 0,
        marginTop: 10,
      },
    },
  }),
);

const RenderHtmlField: React.FunctionComponent<Props> = ({ isDisabled = false }) => {
  const classes = styles();
  return (
    <InputField
      name="renderHTML"
      label="common.renderHTML"
      inputProps={{ id: "RenderHTML", rows: 5, multiline: true, disabled: isDisabled }}
      inputStyleProps={classes.textbox}
    />
  );
};

export default RenderHtmlField;
