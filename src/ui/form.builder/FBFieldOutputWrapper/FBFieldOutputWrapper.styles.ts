import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface StylesProps {
  mt: number
  mb: number
}

export default makeStyles((theme: Theme) =>
  createStyles({
    root: ({ mt, mb }: StylesProps) => ({
      marginTop: theme.spacing(mt),
      marginBottom: theme.spacing(mb),
    }),
    inlineStyle: {
      display: 'inline-block',
      width: 'calc(33.333% - 12px)',
      marginRight: '12px',
    },
  }),
);
