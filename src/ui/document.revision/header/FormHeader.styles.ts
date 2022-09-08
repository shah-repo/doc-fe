import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    lastEdited: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 1.25,
      color: Colors.white,
    },
    cloudIcon: {
      marginRight: 10,
    },
    linearProgress: (isCreateUrl: boolean) => ({
      position: "absolute",
      left: isCreateUrl ? 0 : 10,
      right: isCreateUrl ? 0 : 10,
      bottom: isCreateUrl ? 0 : 10,
      borderBottomLeftRadius: isCreateUrl ? 0 : theme.shape.borderRadius,
      borderBottomRightRadius: isCreateUrl ? 0 : theme.shape.borderRadius,
    }),
  })
);
