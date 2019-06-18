import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    linkContainer: {
      borderBottom: '1px solid gray',
    },
    linkTitle: {
      color: 'red',
      textDecoration: 'none',
      fontWeight: 500,
    },
    linkBody: {
      textDecoration: 'none',
      color: 'gray',
      lineHeight: '25px',
    },
  },
));
