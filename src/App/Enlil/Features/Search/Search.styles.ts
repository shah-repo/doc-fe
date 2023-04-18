import { makeStyles } from "@material-ui/core/styles";
import { omit } from "lodash";
import { Colors } from "../../../../ui/layout/theme-next";

export default makeStyles((theme) => ({
  root: {
    width: 350,
    height: 42,
  },
  focused: {
    width: "100%",
    background: "yellow",
  },
  popper: {
    width: "100%",
  },
  paper: {
    ...omit(theme.overrides?.MuiMenu?.paper, "marginTop", "paddingTop"),
    boxShadow: theme.shadows[2],
    marginTop: -40,
    paddingTop: 40,
    border: `1px solid ${Colors.textBlack}`,
  },
  searchIcon: {
    color: Colors.textBlack,
  }
  ,
  input: {
    borderBottom: "none",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    height: 46,
  },
  list: {
    borderTop: `1px solid ${Colors.stroke}`,
  },
  groupLabel: {
    borderTop: `1px solid ${Colors.aliceBlue}`,
    marginRight: 11,
    marginLeft: 11,
  },
  inputBaseRoot: {
    cursor: "pointer",
  },
  inputRoot: {
    cursor: "pointer",
    zIndex: 1400,
  },
}));
