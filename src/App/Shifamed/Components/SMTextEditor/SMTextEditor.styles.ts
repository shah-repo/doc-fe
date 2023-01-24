import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../ui/layout/theme/utils/colors";

export const editorStyles = {
  toolbarStyle: {
    border: "none",
    borderBottom: `1px solid ${Colors.hint_gray}`,
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  editorStyle: {
    padding: "0 4px",
    width: "100%",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "24px",
    height: "auto",
  },
};

export const SMEditorStyles = makeStyles((theme) =>
  createStyles({
    descriptionEditorClass: {
      "display": "-webkit-box",
      "-webkit-line-clamp": 2,
      "-webkit-box-orient": "vertical",
      "overflow": "hidden !important",
      "& .public-DraftStyleDefault-block": {
        margin: "0px !important",
      },
    },
    descriptionToolbarEditorClass: {
      marginBottom: "0px !important",
      borderLeft: "1px solid #2684FF !important",
      borderTop: "1px solid #2684FF !important",
      borderRight: "1px solid #2684FF !important",
      borderRadius: "4px 4px 0px 0px !important",
      position: "inherit !important" as any,
    },
    descriptionMainEditorClass: {
      borderLeft: "1px solid #2684FF !important",
      borderBottom: "1px solid #2684FF !important",
      borderRight: "1px solid #2684FF !important",
      borderRadius: "0px 0px 4px 4px",
    },
    descriptionSummaryEditorClass: {
      "& .public-DraftStyleDefault-block": {
        margin: "0px !important",
      },
    },
    moreOrLess: {
      "color": Colors.dodger_blue,
      "padding": theme.spacing(0, .25),
      "margin": theme.spacing(0, .5),
      "fontSize": 14,
      "textTransform": "lowercase",
      "&:hover": {
        background: "unset",
      },
    },
  }));
