import { createStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default () =>
  createStyles({
    descriptionContainer: {
      "border": "0 !important",
      "maxHeight": "150px",
      "overflow": "auto",
      "fontSize": "14px",
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
