import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    emailMessage: {
        display: "flex",
        justifyContent: "flex-start",
        marginTop: "20px",
      },
      requestEmail: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
      },
  }),
);
