import { Box, IconButton } from "@material-ui/core";
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

export const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ bookmarks }) => {

  const { bookmarkState } = FB.useStores();
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);

  useObserver(() => {
    bookmarks = bookmarkState?.bookmarks;
  });

  return (
    <Box pt={0.4}>
      <FBMapWrapper<FBBookmarkItem[]> collection={bookmarks || []}>
        {(bookmark: FBBookmarkItem, index) => {
          const { name: hash, label = "" } = bookmark;
          const link = window.location.href.split("#");
          return (
            <Box display="flex" py={0.3} pl={1}>
              <Box flexGrow={1}>
                <Link
                  to={{ hash }}
                  key={`fb-bookmark-${hash}-${index}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Box
                    color={Colors.dark_gray}
                    fontWeight={selectedIndex === index ? 500 : 100}
                  >
                    {label}
                  </Box>
                </Link>
              </Box>
              <Box mr={3.5}>
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
