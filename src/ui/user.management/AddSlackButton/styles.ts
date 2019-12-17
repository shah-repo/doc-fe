import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    slackButton: {
      border: "1px solid" + theme.palette.primary.main,
    },
    slackLogo: {
      marginRight: "5px",
    },
  }),
);
