import { makeStyles } from "@material-ui/core";

const GridStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 109px)",
  },
}
));
export default GridStyles;
