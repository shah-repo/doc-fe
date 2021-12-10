import { makeStyles } from "@material-ui/core";

const GridCellStyles = makeStyles((theme) => ({
  topButton: {
    display: "flex",
    alignItems: "center",
  },
  dot: {
    height: "6px",
    width: "6px",
    borderRadius: "50%",
  },
  Active: {
    background: "#0DB78D",
  },
  Inactive: {
    background: "#B4B4B4",
  },
  value: {
    margin: "5px",
  },
}
));
export default GridCellStyles;
