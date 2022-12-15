import { createStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default () =>
  createStyles({
    description: {
      "border": 0,
      "maxHeight": "8em",
      "width": "100%",
      "overflow": "auto",
      "fontSize": 14,
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
    root: {
      marginBottom: -24,
    },
    button: {
      fontSize: 14,
      color: Colors.navy,
      marginTop: -3,
      paddingLeft: 5,
      cursor: "pointer",
    },
  });
