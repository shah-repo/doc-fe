import React from "react";
import { InputLabel, Theme } from "@material-ui/core";
import OutlinedInput, { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import { createStyles, withStyles } from "@material-ui/core/styles";

interface ModifiedOutlinedInputProps extends Omit<OutlinedInputProps, "labelWidth"> {
  labelWidth?: OutlinedInputProps["labelWidth"];
}

export const InputField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(4),
        padding: "2px 0 0 0",
      },
    },
    input: {
      position: "relative",
      fontSize: theme.spacing(2),
      width: "auto",
      padding: theme.spacing(2),
      flex: 1,
    },
  }),
)(OutlinedInput as React.ComponentType<ModifiedOutlinedInputProps>);

export const LabelField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: "translate(0, 1px) scale(0.97)",
      fontFamily: "Sora, sans-serif;",
    },
  }),
)(InputLabel);
