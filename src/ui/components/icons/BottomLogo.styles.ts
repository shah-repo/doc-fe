import { createStyles, makeStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      color: theme.palette.secondary.contrastText,
      letterSpacing: 1,
      fontWeight: 100,
      marginTop: 20,
    },
    logo: {
      width: 60,
      marginLeft: 10,
    },
  }),
);

export default styles;
