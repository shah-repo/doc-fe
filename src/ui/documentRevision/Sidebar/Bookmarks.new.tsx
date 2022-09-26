import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import copy from "copy-to-clipboard";
import { useObserver } from "mobx-react";
import React from "react";
import { useHistory } from "react-router-dom";
import { SM } from "../../../App";
import { tooltipStyles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as CopyIcon } from "../../../assets/images/copy_outlined.svg";
import { FB, FBBookmarkItem, FBMapWrapper, FBTooltip } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./Bookmarks.new.styles";

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="top" classes={classes} {...props} />;
};

const Bookmarks: React.FC = () => {
  const history = useHistory();
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const { _tabsState } = SM.useStores();
  const bookmarks = useObserver(() => bookmarkState?.bookmarks);
  const [selectedBookmarkName, setSelectedBookmarkName] = React.useState<string>();

  const handleBookmarkClick = ({ name, tabId }: FBBookmarkItem) => {
    setSelectedBookmarkName(name);

    if (tabId) {
      _tabsState?.setActiveTabId(tabId);
    }

    history.push(`#${name}`);
  };

  return (
    <Box m={1.875}>
      <FBMapWrapper<FBBookmarkItem[]>
        collection={bookmarks?.sort((a, b) => ((a?.name || "") > (b?.name || "")  ? 1 : -1)) || []}>
        {(bookmark: FBBookmarkItem, index) => {
          const { name, label = "" } = bookmark;
          const link = window.location.href.split("#");
          return (
            <Box
              display="flex"
              mb={1.875}
              alignItems="center"
              key={`fb-bookmark-${name}-${index}`}
            >
              <Box width={172}>
                <Box
                  color={Colors.dark_gray}
                  onClick={() => handleBookmarkClick(bookmark)}
                >
                  <Typography
                    className={classes.label}
                    style={{ fontWeight: selectedBookmarkName === name ? 500 : "normal" }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
              <StyledTooltip title="common.copy.link">
                <IconButton
                  className={classes.iconButton}
                  size="small"
                  onClick={() => copy(`${link[0]}#${name}`)}
                >
                  <CopyIcon />
                </IconButton>
              </StyledTooltip>
            </Box>
          );
        }}
      </FBMapWrapper>
    </Box>
  );
};

export default Bookmarks;
