import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { AttachmentStyleProps } from "./utils/types";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    Box: {
      minWidth: 150,
      paddingBottom: 25,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    submitButton: {
      float: "right",
      clear: "right",
    },
    closeIcon: {
      fontSize: "inherit",
      color: theme.palette.secondary.light,
    },
    closeRoot: () => ({
      padding: theme.spacing(0.5, 0.5, 0),
      color: theme.palette.secondary.light,
      marginLeft: "auto",
    }),
    headerText: {
      padding: "20px",
    },
    h4: {
      margin: 5,
    },
    link: ({ isField }: AttachmentStyleProps) => ({
      display: isField ? "flex" : "block",
      padding: 10,
      color: "grey",
    }),
    input: {
      display: "none",
    },
    iconRedline: ({ isField }: AttachmentStyleProps) => ({
      display: isField ? "inherited" : "none",
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
      color: "red",
    }),
    iconCleanCopy: ({ isField }: AttachmentStyleProps) => ({
      display: isField ? "inherited" : "none",
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
      color: "STEELBLUE",
    }),
  }),
);
