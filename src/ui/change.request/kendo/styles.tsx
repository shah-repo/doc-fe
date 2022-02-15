import { makeStyles } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 109px)",
  },
}));

export default KendoGridStyles;
