import { makeStyles } from "@material-ui/core";

const GridStyles = makeStyles((theme) => ({
  root: {
    textAlign: "right",
    marginLeft: "5px",
    fontFamily: "Sora",
  },
  kGrid: {
    width: "calc(100vw - 263px)",
    height: "calc(100vh - 125px)",
    margin: "5px",
  },
  columnsCus: {
    fontFamily: "Sora",
    fontWeight: "bold",
    fontSize: "14px",
  },
}
));
export default GridStyles;
