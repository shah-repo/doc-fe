import { makeStyles } from "@material-ui/core";

const GridStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing(0, 0.625, 1.25),
  },
  kGrid: {
    height: "calc(100vh - 99px)",
  },
}
));
export default GridStyles;
