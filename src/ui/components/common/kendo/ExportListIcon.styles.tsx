import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    iconSvg: {
      fill: Colors.navy,
      marginRight: theme.spacing(0.625),
    },
    disabledIconSvg: {
      fill: Colors.white,
      marginRight: theme.spacing(0.625),
    },
  })
);
