import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) => ({
  statusIcon: {
    height: 7,
    width: 7,
    marginRight: theme.spacing(1),
    borderRadius: "50%",
  },
  openStatusIcon: {
    backgroundColor: Colors.dodger_blue,
  },
  closeStatusIcon: {
    backgroundColor: Colors.font_gray,
  },
  voidStatusIcon: {
    backgroundColor: Colors.latest_red_varient,
  },
}));
