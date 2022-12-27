import { makeStyles } from "@material-ui/core";
import { loadMoreStyles } from "../../Dashboard.styles";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 0, 1),
  },
  listRoot: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, .5),
  },
  loadMore: loadMoreStyles(theme),
}));
