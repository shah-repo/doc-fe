import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const loadMoreStyles = (theme: Theme) => ({
  margin: theme.spacing(5, 1, .5),
});

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
  tabs: {
    height: "100%",
  },
  stats: {
    height: "100%",
    paddingTop: 56,
  },
  loadMore: loadMoreStyles(theme),
}));
