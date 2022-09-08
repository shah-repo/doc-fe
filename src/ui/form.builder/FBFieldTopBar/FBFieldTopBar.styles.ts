import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const HEIGHT = 35;
const WIDTH = 128;

export default makeStyles((theme) => ({
  root: {
    position: "absolute",
    right: 0,
    left: 0,
    top: -HEIGHT,
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 5,
  },
  tools: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: WIDTH,
    height: HEIGHT,
    padding: theme.spacing(1),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    background: Colors.dodger_blue,
    color: Colors.white,
    cursor: "pointer",
  },
}));
