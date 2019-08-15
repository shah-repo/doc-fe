import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    display: "grid",
  },
  textField: {
    "gridArea": "1/1",
    "width": "94%",
    "background": "transparent",
    "borderRadius": 0,
    "& input": {
      background: "transparent",
    },
  },
  selectField: {
    "gridArea": "1/1",
    "width": "100%",
    "z-index": "0",
  },
});
