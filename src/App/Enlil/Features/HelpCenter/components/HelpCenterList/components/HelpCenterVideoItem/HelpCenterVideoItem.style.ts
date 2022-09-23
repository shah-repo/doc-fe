import { makeStyles } from "@material-ui/core";
import { itemStyles } from "../../HelpCenterList.styles";

export default makeStyles((theme) => ({
  ...itemStyles(theme),
  video: {
    margin: theme.spacing(2.5),
    backgroundColor: theme.palette.grey[100],
    position: "relative",
  },
  progress: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  player: {
    position: "relative",
    display: "block",
  },
}));
