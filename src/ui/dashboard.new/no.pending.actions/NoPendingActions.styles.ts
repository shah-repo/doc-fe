import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme) => ({
  root: {
    color: Colors.red,
    padding: theme.spacing(2, 1.5),
  },
}));
