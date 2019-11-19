import { createStyles, makeStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      bottom: 30,
      left: 20,
      position: "absolute",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      color: theme.palette.secondary.contrastText,
      letterSpacing: 1,
      fontWeight: 100,
    },
    logo: {
      width: "30%",
      marginLeft: 10,
    },
  }),
);

export default styles;
