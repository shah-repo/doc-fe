import { makeStyles } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme) => ({
  cRoot: {
    width: "99%",
    margin: "5px",
  },
  root: {
    textAlign: "right",
    marginLeft: "5px",
    fontFamily: "Sora",
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 75px)",
  },
  loading: {
    top: 0,
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
}));

export default KendoGridStyles;
