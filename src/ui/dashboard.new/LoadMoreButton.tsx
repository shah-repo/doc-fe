import { Box, Button, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as LoadMore } from "../../assets/images/load_more_arrow.svg";
import Text from "../components/Text";
import Colors from "../layout/theme/utils/colors";

const styles = makeStyles(() =>
  createStyles({
    loadMoreButton: {
      "position": "static",
      "left": "0%",
      "right": "18.54%",
      "top": "0%",
      "bottom": "0%",
      "font-family": "Sora",
      "font-weight": 600,
      "letter-spacing": "0.5px",
      "text-transform": "uppercase",
      "color": Colors.navy,
      "margin": 0,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  },
  ));
interface Props {
  disable?: boolean;
  onLoadMore: () => void;
  position?;
  label?: string;
  id? : string;
}
export const LoadMoreButton: React.FunctionComponent<Props>  = ({ disable = false, onLoadMore, position = "right", label = "common.load.more", id = "boxLoadMore" }) => {
  const classes = styles();
  return (
    <Box style={{ float: position }}>
      <Button
        onClick={() => onLoadMore()}
        className={classes.loadMoreButton}
        disableRipple
        disabled={disable}
        id={id}
      >
        <Text message={label} />
      </Button>
      <LoadMore />
    </Box>
  )
  ; };
