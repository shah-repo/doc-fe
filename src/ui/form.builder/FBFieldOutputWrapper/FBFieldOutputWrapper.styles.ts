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
      width: 'calc((100% - 96px)/3)',
      marginRight: theme.spacing(6),
      '&:nth-child(3n)': {
        marginRight: 0,
      },
    },
  }),
);
