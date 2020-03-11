import { makeStyles } from "@material-ui/core";

export const styles = makeStyles((theme) => ({
  paper: ({ isPDF }: { isPDF: boolean } = { isPDF: false }) => ({
    height: isPDF ? "100%" : undefined,
    marginTop: 100,
    boxShadow: "unset",
    backgroundColor: "transparent",
  }),
  title: {
    position: "fixed",
    top: 0,
    background: "white",
    width: "100%",
    left: 0,
  },
  content: {
    overflow: "hidden",
    height: "85%",
  },
  contentRoot: {
    textAlign: "center",
  },
  buttonsContainer: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    marginRight: 30,
  },
  zoom: {
    maxWidth: "45vw",
    width: "100%",
    maxHeight: "90vh",
    margin: "0 auto",
  },
}));
