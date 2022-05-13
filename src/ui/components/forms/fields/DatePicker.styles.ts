import { makeStyles, Theme } from "@material-ui/core/styles";

export const styles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "transparent",
    fontSize: theme.spacing(2),
    padding: theme.spacing(2),
    marginTop: theme.spacing(3.5),
    border: `1px solid ${theme.palette.text.hint}`,
  },
}));
