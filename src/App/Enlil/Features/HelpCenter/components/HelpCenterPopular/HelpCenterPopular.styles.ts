import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2.5),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  list: {
    marginTop: theme.spacing(1.5),
    marginLeft: theme.spacing(-2.5),
    marginRight: theme.spacing(-2.5),
  },
}));
