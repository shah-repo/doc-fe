import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  root: {
    display: "grid",
  },
  textField: {
    gridArea: "1 / 1",
    width: "90%",
    background: "transparent",
    borderRadius: 0,
    borderRight: "0.5px solid #ccc",
  },
  selectField: {
    "gridArea": "1 / 1",
    "width": "100%",
    "z-index": "0",
    "background": "transparent",
    "&.MuiSelect-icon": {
      right: "5%",
    },
  },
  input: {
    "backgroundColor": "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:before": {
      borderBottomWidth: "0px",
    },
    "&:after": {
      borderBottomWidth: "0px",
    },
  },
});
