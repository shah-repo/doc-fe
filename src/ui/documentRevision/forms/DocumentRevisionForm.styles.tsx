import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles =  makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      width: "100%",
      padding: theme.spacing(2, 5),
      background: Colors.light_gray,
      marginTop: theme.spacing(5),
    },
    reviewButton: {
      marginTop: theme.spacing(3),
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      paddingTop: theme.spacing(3),
      textAlign: "center",
    },
  })
);
