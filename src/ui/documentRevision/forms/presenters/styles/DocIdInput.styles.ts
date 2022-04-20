import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    input: {
      "&.MuiInputBase-root": {
        marginTop: 10,
        padding: 0,
      },
      "& .MuiInputBase-input": {
        padding: 10,
        fontFamily: "Sora",
      },
    },
  }),
);
