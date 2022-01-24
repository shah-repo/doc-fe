import { makeStyles } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0.625, 1.25, 0.625),
  },
  kGrid: {
    height: "calc(100vh - 99px)",
  },
}));

export default KendoGridStyles;
