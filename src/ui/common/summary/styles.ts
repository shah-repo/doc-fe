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
          color: "#474747 !important",
        },
      },
      "whiteSpace": "pre-line",
    },
    btnStyle: {
      fontSize: "14px",
      color: Colors.navy,
    },
  });
