import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme) => ({
  root: {
    pointerEvents: "none",
  },
  paper: {
    pointerEvents: "auto",
    width: "80%",
    maxWidth: "80%",
    minHeight: "80vh",
  },
  close: {
    height: "24px",
    width: "24px",
    backgroundColor: "#F4F4F4",
    borderRadius: "6px",
    margin: theme.spacing(0, 1.25),
  },
  content: {
    padding: 0,
  },
  actions: {
    padding: 0,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 600,
    fontSize: "14px",
    flex: 1,
    color: Colors.almost_black,
  },
}));
