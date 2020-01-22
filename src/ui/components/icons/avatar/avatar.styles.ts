import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    container: {
        border: `8px solid ${"#76608D"}`,
        width: "213px",
        height: "213px",
        borderRadius: "50%",
        backgroundColor: "#76608D",
        zIndex: 9999,
    },
    image: {
        width: "196px",
        height: "196px",
        borderRadius: "50%",
    },
  }),
);
