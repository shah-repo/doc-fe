import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const DRAWER_WIDTH = 300;

export default makeStyles((theme) => ({
  root: {
    width: DRAWER_WIDTH,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  titleOuterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  titleContainer: {
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
    margin: theme.spacing(0, .25),
  },
  iconContainer: {
    display: "flex",
    height: 24,
    flex: "none",
    margin: theme.spacing(0, .25),
  },
  externalContainer: {
    padding: theme.spacing(1.25, .5, 1.25, 2.5),
    boxShadow: `0 1px 0 ${Colors.link_water}`,
    margin: "1px 0px",
  },
  listItemContainer: {
    overflow: "auto",
  },
  listActions: {
    borderTop: `1px solid ${Colors.link_water}`,
  },
  loadMore: {
    alignSelf: "flex-start",
    margin: theme.spacing(.75, 1.5),
  },
}));
