import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    lineHeight: 1.25,
    color: Colors.white,
    marginRight: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));
