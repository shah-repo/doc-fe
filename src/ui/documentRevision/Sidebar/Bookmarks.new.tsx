import { Box, createStyles, IconButton, makeStyles, Typography } from "@material-ui/core";
import copy from "copy-to-clipboard";
import { useObserver } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CopyIcon } from "../../../assets/images/copy_outlined.svg";
import { FB, FBBookmarkItem, FBMapWrapper, FBTooltip } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";

interface SidebarPresenterProps {
  bookmarks?: FBBookmarkItem[];
}

const styles = makeStyles(() =>
  createStyles({
    label: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.almost_black,
    },
  }));

const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ bookmarks }) => {

  const classes = styles();

  const { bookmarkState } = FB.useStores();
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);

  useObserver(() => {
    bookmarks = bookmarkState?.bookmarks;
  });

  return (
    <Box p={1.875}>
      <FBMapWrapper<FBBookmarkItem[]> collection={bookmarks || []}>
        {(bookmark: FBBookmarkItem, index) => {
          const { name: hash, label = "" } = bookmark;
          const link = window.location.href.split("#");
          return (
            <Box display="flex" pb={1.875} alignItems="center" key={`fb-bookmark-${hash}-${index}`}>
              <Box width={172}>
                <Link
                  to={{ hash }}
                  style={{ textDecoration: "none" }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Box
                    color={Colors.dark_gray}
                    fontWeight={selectedIndex === index ? 500 : 100}
                  >
                    <Typography className={classes.label}>
                      {label}
                    </Typography>
                  </Box>
                </Link>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => copy(`${link[0]}#${hash}`)}>
                  <FBTooltip title="common.copy.link">
                    <CopyIcon/>
                  </FBTooltip>
                </IconButton>
              </Box>
            </Box>
          );
        }}
      </FBMapWrapper>
    </Box>
  );
};

export default Bookmarks;
