import { createStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default () =>
  createStyles({
    descriptionContainer: {
      "border": "0 !important",
      "maxHeight": "8em",
      "width": "calc(95vw - 559px)",
      "overflow": "auto",
      "fontSize": "16px",
      "display": "flex",
      "&.ql-container.ql-snow": {
        "border": 0,
        "& .ql-editor": {
          padding: 0,
          fontFamily: "Sora",
          color: "#474747 !important",
        },
      },
      "whiteSpace": "pre-line",
    },
    btnStyle: {
      fontFamily: "Sora",
      fontSize: "14px",
      color: Colors.navy,
    },
    spanStyleNoWrap: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      wordWrap: "normal",
      overflow: "hidden",
      fontFamily: "Sora",
      fontSize: "14px",
      width: "89%",
    },
    spanStylePreWrap: {
      whiteSpace: "pre-wrap",
      wordWrap: "normal",
      fontFamily: "Sora",
      fontSize: "14px",
      width: "89%",
    },
  });
