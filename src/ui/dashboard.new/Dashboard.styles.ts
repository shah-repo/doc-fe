import { makeStyles } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export default makeStyles((theme) => ({
  box: {
    height: "100%",
    boxShadow: "0 0 25px rgba(41, 41, 41, 0.2)",
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: theme.spacing(1, 1, 0),
    background: Colors.white,
    marginRight: 50,
    marginLeft: 50,
    zIndex: 1,
    position: "relative",
  },
  root: {
    width: "100%",
    height: "100%",
    margin: "auto",
    overflow: "hidden",
  },
  stats: {
    paddingTop: 65,
    display: "flex",
    flexDirection: "column",
  },
}));
