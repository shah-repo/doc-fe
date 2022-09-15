import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
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
