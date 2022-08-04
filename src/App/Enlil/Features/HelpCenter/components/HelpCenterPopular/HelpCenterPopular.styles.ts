import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2.5),
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    list: {
      marginTop: theme.spacing(1.5),
      marginLeft: theme.spacing(-2.5),
      marginRight: theme.spacing(-2.5),
    },
  })
);

export default useStyles;
