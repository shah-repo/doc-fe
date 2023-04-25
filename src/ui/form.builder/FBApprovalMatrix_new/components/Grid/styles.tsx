import { makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
  updating: {
    "position": "relative",
    "z-index": 3,
    "box-shadow": "0 0 0 1px red !important",
  },
  save: {
    position: "relative",
  },
  discard: {
    position: "relative",
  },
}));
