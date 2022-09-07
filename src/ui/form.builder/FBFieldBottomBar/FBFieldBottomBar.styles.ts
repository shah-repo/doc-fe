import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme) => ({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    display: "flex",
    justifyContent: "center",
    zIndex: 5,
  },
  button: {
    margin: 0,
    borderRadius: theme.shape.borderRadius,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: theme.spacing(40),
    border: 0,
    backgroundColor: Colors.dodger_blue,
  },
}));
