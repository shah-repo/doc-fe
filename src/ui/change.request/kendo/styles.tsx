import { makeStyles } from "@material-ui/core";

const KendoGridStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    padding: "0 5px 10px 5px",
  },
  kGrid: {
    height: "calc(100vh - 115px)",
  },
}));

export default KendoGridStyles;
