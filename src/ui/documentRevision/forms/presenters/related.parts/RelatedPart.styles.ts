import { makeStyles } from "@material-ui/core";

export const styles = makeStyles({
  mainDiv: {
    marginBottom: "2rem",
  },
  title: {
    display: "flex",
    padding: "5px",
    paddingLeft: "16px",
    alignItems: "center",
  },
  formControlPad: {
    paddingLeft: "16px",
  },
  fullWidth: {
    width: "100%",
  },
  btn: {
    "&:hover": {
      background: `linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)`,
    },
  },
  disableRipple: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  fullLengthButton: {
    "borderStyle": "dashed",
    "borderColor": "blue",
    "width": "100%",
    "margin": 0,
    "borderRadius": "0 0 5px 5px",
    "color": "#011FBB",
    "&:hover": {
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderColor: "blue",
      color: "#011FBB",
      // backgroundColor: "#011FBB",
      // color: "white",
    },
  },
  customTooltip: {
    backgroundColor: "black",
  },
  customArrow: {
    color: "black",
  },
  titleHeading: {
    marginRight: "10px",
    display: "inline-block",
  },
  partsGrid: {
    paddingLeft: "12px",
    marginBottom: "1rem",
  },
  btnMargin: {
    marginRight: 0,
  },
  dividerStyle: {
    margin: "0 0 12px 0",
  },
  tableHeadHieght: {
    height: "40px",
  },
  editRowParentDiv: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    border: "1px solid #01A6C7",
    borderRadius: "0 0 5px 5px",
  },
  editRowChildDivOne: {
    width: "30%",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    justifyContent: "space-evenly",
    padding: "0 12px",
    alignItems: "center",
    columnGap: "4px",
  },
  editRowChildDivTwo: {
    width: "50%",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    justifyContent: "space-evenly",
    padding: "0 15px",
    alignItems: "center",
  },

  actionButtonParentDiv: {
    width: "100%",
    position: "relative",
    marginBottom: "20px",
  },
  actionButtonChildDiv: {
    width: "100px",
    backgroundColor: "#01A6C7",
    position: "absolute",
    right: 0,
    borderRadius: "0 0 5px 5px",
    display: "flex",
    justifyContent: "center",
  },
  actionButton: {
    backgroundColor: "white",
    padding: "4px",
    minWidth: "auto",
    border: "8px",
  },
  iconButton: {
    "fontSize": "16px",
    "fill": "#000",
    "&:hover": {
      color: "blue",
    },
  },
  viewIcon: {
    fill: "#01A6C7",
    marginTop: "5px",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  tableHeadHeight: {
    height: "34px",
  },
  tabelCell: {
    backgroundColor: "#e2e8f0",
    color: "rgb(8, 11, 17)",
  },
  tableCellOne: {
    width: "30%",
    borderRadius: "5px 0 0 0",
    paddingLeft: "15px",
  },
  tableCellTwo: {
    width: "45%",
  },
  tableCellThree: {
    width: "15%",
  },
  tableCellFour: {
    width: "10%",
    borderRadius: "0 5px 0 0",
  },
  verticalDivider: {
    borderLeft: "2px solid white",
    paddingLeft: "10px",
  },
  successMessage: {
    width: "380px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textField: {
    "padding": "8px 6px",
    "& .MuiInputBase-root": {
      marginTop: 0,
      padding: 0,
      // width: "150px",
    },
    "& .MuiOutlinedInput-input": {
      padding: 10,
      fontSize: 14,
      fontWeight: "bold",
    },
  },
});
