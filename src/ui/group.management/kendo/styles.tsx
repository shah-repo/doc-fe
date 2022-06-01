import { makeStyles, Theme } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "right",
  },
  kGrid: {
    height: "calc(100vh - 119px)",
  },
  loading: {
    top: 0,
  },
}));

export default KendoGridStyles;
