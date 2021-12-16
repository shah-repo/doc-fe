import { makeStyles } from "@material-ui/core";

const KendoGridStyles = makeStyles(() => ({
  root: {
    textAlign: "right",
    marginLeft: "5px",
    fontFamily: "Sora",
  },
  cRoot: {
    width: "99%",
    margin: "5px",
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 75px)",
  },
  loading: {
    top: 0,
  },
}));

export default KendoGridStyles;
