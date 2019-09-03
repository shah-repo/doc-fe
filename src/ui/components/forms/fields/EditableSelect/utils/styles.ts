import { makeStyles } from "@material-ui/core";
import { FieldStyleProps } from "../../Field";

export const styles = makeStyles(theme => ({
  root: ({ gutter }: FieldStyleProps) => ({
    display: "grid",
  }),
  textField: {
    gridArea: "1/1",
    width: "94%",
    background: "transparent",
    borderRadius: 0,
    "& input": {
      background: "transparent",
      border: "none",
    },
  },
  selectField: {
    gridArea: "1/1",
    width: "100%",
    "z-index": "0",
  },
}));
