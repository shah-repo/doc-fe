import { makeStyles } from "@material-ui/core";
import { itemStyles } from "../HelpCenterList/HelpCenterList.styles";

export default makeStyles((theme) => ({
  ...itemStyles(theme),
  list: {
    flexGrow: 1,
  },
  contact: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));
