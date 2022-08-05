import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2.5),
    },
    list: {
      marginLeft: theme.spacing(-2.5),
      marginRight: theme.spacing(-2.5),
    },
  })
);

export default useStyles;
