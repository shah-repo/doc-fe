import { makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";
import { AttachmentIconStyleProp } from "./types";

export const styles = makeStyles((theme) => ({
  root: ({ size }: AttachmentIconStyleProp) => ({
    display: "grid",
    width: size === "lg" ? "90px" : size === "md" ? "70px" : "50px",
    height: size === "lg" ? "90px" : size === "md" ? "70px" : "50px",
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
  attachmentContainer: {
    "display": "flex",
    "width": "50%",
    "alignItems": "center",
    "marginBottom": "1rem",
    "&:hover": {
      backgroundColor: "white",
      borderRadius: "8px",
    },
  },
  iconContainer: {
    maxHeight: "48px",
    margin: "0.8rem",
  },
  removeButton: {
    "margin": 0,
    "minWidth": 40,
    "borderRadius": "inherit",
    "min-width": "auto",
    "&:hover": {
      backgroundColor: Colors.red,
    },
  },
  fileNameContainer: {
    width: 170,
    cursor: "pointer",
  },
  fileName: {
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto",
    maxWeight: "1rem",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "bold",
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
  underLine: {
    border: "2px solid red",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  primaryBadge: {
    position: "absolute",
    zIndex: 1,
    top: -5,
    left: 2,
  },
}));
