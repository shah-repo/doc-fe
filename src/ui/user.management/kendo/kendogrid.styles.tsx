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
    "minWidth": "calc(100vw - 263px)",
    "height": "calc(100vh - 75px)",
    "borderRadius": "4px 4px 0px 0px",
    "& .k-grid-table": {
      "& tbody": {
        "& tr": {
          cursor: "pointer !important",
        },
        "& td, th": {
          borderWidth: "0 0 0px 0px",
        },
      },
    },
    "& .k-grid-header": {
      "& table": {
        "& thead": {
          "& th": {
            borderWidth: "0 1px 0 0",
            borderColor: "#FFFFFF",
            borderStyle: "solid",
          },
        },
      },
    },
  },
  // loading: {
  //   marginTop: "350px",
  // },
  kGridFont: {
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    color: "#080B11",
  },
  columnsCus: {
    fontFamily: "Sora",
    fontWeight: "bold",
    fontSize: "14px",
  },
  groupCell: {
    whiteSpace: "pre-wrap",
  },
}));

export default KendoGridStyles;
