import { createStyles, makeStyles } from "@material-ui/core";

export const SMEditorStyles = makeStyles(() =>
  createStyles({
    descriptionEditorClass: {
      "display": "-webkit-box",
      "-webkit-line-clamp": 2,
      "-webkit-box-orient": "vertical",
      "overflow": "hidden !important",
    },
    descriptionToolbarEditorClass: {
      marginBottom: "0px !important",
      borderLeft: "1px solid #2684FF !important",
      borderTop: "1px solid #2684FF !important",
      borderRight: "1px solid #2684FF !important",
      borderRadius: "4px 4px 0px 0px !important",
    },
    descriptionMainEditorClass: {
      borderLeft: "1px solid #2684FF !important",
      borderBottom: "1px solid #2684FF !important",
      borderRight: "1px solid #2684FF !important",
      borderRadius: "0px 0px 4px 4px",
    },
  }));
