import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    columnsCus: {
      fontFamily: "Sora",
      fontWeight: "bold",
      fontSize: "14px",
    },
    headerMenuItem: {
      "background": Colors.water,
      "cursor": "default",
      "&:hover": {
        background: Colors.water,
      },
    },
  })
);
