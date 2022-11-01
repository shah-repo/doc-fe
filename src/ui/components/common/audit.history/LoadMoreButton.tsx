import { Box, Button, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as LoadMore } from "../../../../assets/images/load_more_arrow.svg";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

const styles = makeStyles(() =>
  createStyles({
    loadMoreButton: {
      "fontSize": "10px",
      "font-weight": 600,
      "letter-spacing": "0.5px",
      "color": Colors.navy,
      "margin": 0,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  })
);
interface Props {
  disable?: boolean;
  onLoadMore: () => void;
  label?: string;
  id?: string;
}
export const LoadMoreButton: React.FunctionComponent<Props> = ({
  disable = false,
  onLoadMore,
  label = "common.load.more",
  id = "boxLoadMore",
}) => {
  const classes = styles();
  return (
    <Box style={{ float: "left" }}>
      <Button
        onClick={() => onLoadMore()}
        className={classes.loadMoreButton}
        disableRipple
        disabled={disable}
        id={id}
      >
        <Text message={label} />
      </Button>
      <LoadMore fill={disable ? Colors.hint_gray : Colors.navy} />
    </Box>
  );
};
