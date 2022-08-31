import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    margin: 0,
    borderRadius: theme.shape.borderRadius,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: theme.spacing(40),
    border: 0,
    background: Colors.dodger_blue,
  },
}));
