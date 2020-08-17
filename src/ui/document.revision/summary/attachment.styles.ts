import { createStyles } from "@material-ui/core";

export default (isAttachmentEmpty) =>
  createStyles({
    buttonsContainer: {
      display: "flex",
    },
    buttonLeft: {
      flex: "0 0 50%",
      display: "flex",
      justifyContent: "flex-start",
    },

    buttonRight: {
      flex: "0 0 50%",
      display: isAttachmentEmpty ? "none" : "flex",
      justifyContent: "flex-end",
      paddingRight: "25px",
      cursor: "pointer",
    },
    icon: {
      verticalAlign: "middle",
    },
  });
