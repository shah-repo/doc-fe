import { createStyles, makeStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    svgRoot: {
      marginLeft: 3,
    },
    border: {
      fill: "none",
      stroke: theme.palette.secondary.contrastText,
      strokeMiterlimit: 10,
    },
    pen: {
      fill: "none",
      stroke: theme.palette.secondary.contrastText,
      strokeMiterlimit: 10,
      strokeLinecap: "square",
    },
  }),
);

export default styles;