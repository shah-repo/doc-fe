import { makeStyles } from "@material-ui/core";

const GridStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
    height: "66px",
    alignContent: "flex-end",
  },
  kGridRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 135px)",
  },
}
));
export default GridStyles;
