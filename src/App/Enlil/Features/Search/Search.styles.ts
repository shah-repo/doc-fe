import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    background: "red",
  },
  searchContainer: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px",
    gap: "10px",
    width: "393px",
    height: "34px",
    left: "250px",
    top: "7px",
    background: "#FFFFFF",
    border: " 1px solid #9A9FAB",
    borderRadius: "4px",
    cursor: "pointer",
  },
  expanded: {
    width: "867px",
  },

  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // "borderRadius": "50%",
    // "backgroundColor": theme.palette.background.paper,
    marginLeft: "10px",
    width: "22px",
    height: "24px",
    cursor: "pointer",
    color: "#767B87",
  },
  autoComplete: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  inputBox: {
    "borderRadius": "6px",
    "border": "1px solid gray",
    "fontSize": "16px",
    "padding": "8px",
    "&:focus": {
      outline: "0",
      border: "1px solid rgb(8, 8, 8)",
    },
  },
  dropdown: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "6px",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    border: "1px solid gray",
    borderTop: "0",
    overflow: "auto",
  },
  dropdownItem: {
    "textAlign": "left",
    "height": "18px",
    "padding": "8px",
    "color": "rgb(43, 43, 43)",
    "borderTop": "1px solid gray",
    "&:first-child": {
      borderTop: "0",
    },
  },
}));
