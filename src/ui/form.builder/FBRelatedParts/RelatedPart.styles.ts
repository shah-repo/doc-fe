import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  title: {
    flex: "1 1 100%",
    padding: "16px",
    paddingLeft: "16px",
    justifyContent: "space-between",
  },
  mainDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "10%",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "2px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "skyBlue",
  },
  mainDiv1: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "10%",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "2px",
    border: "solid 0.5px grey",
    borderRadius: "5px",
  },
  btn: {
    borderRadius: "16px",
    width: "auto",
    height: "5vh",
    padding: "16px",
    margin: "10px",
  },
  disableRipple: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  fulllengthButton: {
    width: "100%",
    borderStyle: "dashed",
    borderColor: "blue",
  },
  itemSpace: {
    margin: "10px",
  },
  hideFiled: {
    visibility: "hidden",
  },
  textField: {},
});

export default useStyles;
