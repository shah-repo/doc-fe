import { makeStyles } from "@material-ui/core";
import { itemStyles } from "../../HelpCenterList.styles";

export default makeStyles((theme) => ({
  ...itemStyles(theme),
  video: {
    padding: theme.spacing(2.5),
  },
}));
