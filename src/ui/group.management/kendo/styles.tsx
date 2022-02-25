import { makeStyles, Theme } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "right",
    fontFamily: "Sora",
  },
  kGrid: {
    height: "calc(100vh - 119px)",
    width: "calc(100vw - 280px)",
  },
  loading: {
    top: 0,
  },
}));

export default KendoGridStyles;
