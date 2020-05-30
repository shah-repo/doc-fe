import { makeStyles } from "@material-ui/core";
import { AttachmentIconStyleProp } from "./types";

export const styles = makeStyles((theme) => ({
  root: ({ size }: AttachmentIconStyleProp) => ({
    display: "grid",
    width: size === "lg" ? "90px" : size === "md" ? "70px" : "50px",
    height: size === "lg" ? "90px" : size === "md" ? "70px" : "50px",
  }),
  closeRoot: ({ size, disabled }: AttachmentIconStyleProp) => ({
    margin:
      size === "lg"
        ? theme.spacing(0, 0, -1.7, 4.5)
        : size === "md"
          ? theme.spacing(0, 0, -1.3, 3.7)
          : theme.spacing(0, 0, -1.4, 3.1),
    padding: theme.spacing(0.5, 0.5, 0),
    fontSize: size === "lg" ? "1.3em" : size === "md" ? "1.2em" : "1.1em",
    display: disabled ? "none" : "inherit",
  }),
  progress: ({ size }: AttachmentIconStyleProp) => ({
    "color": theme.palette.secondary.main,
    "width":
      (size === "lg" ? "90px" : size === "md" ? "70px" : "50px") + "!important",
    "height":
      (size === "lg" ? "90px" : size === "md" ? "70px" : "50px") + "!important",
    "& .MuiCircularProgress-svg": {
      margin: theme.spacing(2.5),
    },
  }),
  fileName: {
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto",
    maxWidth: "4.38rem",
    maxWeight: "1rem",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  closeIcon: {
    fontSize: "inherit",
    color: theme.palette.primary.main,
  },
  fileIcon: {
    width: "100%",
    height: "100%",
    color: "#ccc",
    fontSize: "100%",
    gridArea: "1/1",
  },
  isUploading: {
    opacity: 0.5,
  },
  ribbonWrapper: {
    position: "relative",
    gridArea: "1/1",
    margin: "auto",
    width: "80%",
    height: "100%",
  },
  ribbonFrontSize: ({ size }: AttachmentIconStyleProp) => ({
    fontSize: size === "lg" ? "1.3em" : size === "md" ? "1em" : "0.7em",
  }),
  ribbonFront: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    position: "relative",
    top: "55%",
    textAlign: "center",
    height: "30%",
    fontWeight: "bold",
    paddingTop: "1px",
    color: theme.palette.common.white,
  },
  ribbonEdgeTopleft: {
    top: "50%",
    left: "0",
    borderColor: "transparent #99c transparent transparent",
    position: "absolute",
    borderStyle: "solid",
    height: "0px",
    width: "0px",
  },
  ribbonEdgeTopleftBorder: (props: AttachmentIconStyleProp) => ({
    borderWidth:
      props.size === "lg"
        ? "5px 7px 0 0"
        : props.size === "md"
          ? "3px 5px 0 0"
          : "3px 4px 0 0",
  }),
  ribbonEdgeTopright: {
    "top": "50%",
    "borderWidth": "5px 0 0 10px",
    "right": "0",
    "borderColor": "transparent transparent transparent #99c",
    "position": "absolute",
    "border-style": "solid",
    "height": "0px",
    "width": "0px",
  },
  ribbonEdgeToprightBorder: (props: AttachmentIconStyleProp) => ({
    borderWidth:
      props.size === "lg"
        ? "5px 0 0 7px"
        : props.size === "md"
          ? "3px 0 0 5px"
          : "3px 0 0 4px",
  }),
}));
