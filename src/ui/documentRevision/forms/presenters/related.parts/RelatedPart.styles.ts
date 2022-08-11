import { makeStyles } from "@material-ui/core";

export const styles = makeStyles({
  mainDiv: {
    marginBottom: "2rem",
  },
  title: {
    flex: "1 1 100%",
    padding: "16px",
    paddingLeft: "16px",
    justifyContent: "space-between",
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
  formControlPad: {
    paddingLeft: "12px",
  },
  btnMargin: {
    marginRight: 0,
  },
  dividerStyle: {
    margin: "0 0 12px 0",
  },
  tableHeadHieght: {
    height: "34px",
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
    padding: "0 15px",
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
  editRowChildDivThree: {
    width: "240px",
    display: "flex",
    justifyContent: "center",
    padding: "0 15px",
    alignItems: "center",
  },

  actionButtonParentDiv: {
    width: "100%",
    position: "relative",
    marginBottom: "20px",
  },
  actionButtonChildDiv: {
    width: "20%",
    backgroundColor: "blue",
    position: "absolute",
    right: 0,
    borderRadius: "0 0 5px 5px",
  },
  actionButton: {
    backgroundColor: "white",
  },
  iconButton: {
    "&:hover": {
      color: "blue",
    },
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
    },
    "& .MuiOutlinedInput-input": {
      padding: 10,
      fontSize: 14,
    },
  },
});
