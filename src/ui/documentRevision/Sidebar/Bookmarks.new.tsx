import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import copy from "copy-to-clipboard";
import { isUndefined } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useHistory } from "react-router-dom";
import { SM } from "../../../App";
import { tooltipStyles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as CopyIcon } from "../../../assets/images/copy_outlined.svg";
import { FB, FBBookmarkItem, FBMapWrapper, FBTooltip } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./Bookmarks.new.styles";

interface SidebarPresenterProps {
  bookmarks?: FBBookmarkItem[];
}

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="top" classes={classes} {...props} />;
};

const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ bookmarks }) => {
  const history = useHistory();
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const { _tabsState } = SM.useStores();
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);
  useObserver(() => {
    bookmarks = bookmarkState?.bookmarks;
  });
  const bookmarkClick = (hash: string | undefined, index, tabIndex: number | undefined) => {
    setSelectedIndex(index);
    if (isUndefined(tabIndex) || tabIndex < 0) {
      return;
    }
    if (tabIndex === _tabsState?.value) {
      history.push(`#${hash}`);
    } else {
        _tabsState?.setValue(tabIndex);
        history.push(`#${hash}`);
    }
  };
  return (
    <Box m={1.875}>
      <FBMapWrapper<FBBookmarkItem[]> collection={bookmarks || []}>
        {(bookmark: FBBookmarkItem, index) => {
          const { name: hash, label = "", tabIndex } = bookmark;
          const link = window.location.href.split("#");
          return (
            <Box
              display="flex"
              mb={1.875}
              alignItems="center"
              key={`fb-bookmark-${hash}-${index}`}
            >
              <Box width={172}>
                <Box
                  color={Colors.dark_gray}
                  onClick={() => bookmarkClick && bookmarkClick(hash, index, tabIndex)}
                >
                  <Typography
                    className={classes.label}
                    style={{ fontWeight: selectedIndex === index ? 500 : "normal" }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
              <StyledTooltip title="common.copy.link">
                <IconButton
                  className={classes.iconButton}
                  size="small"
                  onClick={() => copy(`${link[0]}#${hash}`)}
                >
                  <CopyIcon />
                </IconButton>
              </StyledTooltip>
            </Box>
          );
        }}
      </FBMapWrapper>
      {/* <>
        <Box
          display="flex"
          pb={1.875}
          alignItems="center"
        >
          <IconButton size="small">
            <PlusIcon />
          </IconButton>
          <Box pl={0.5}>
            <Typography className={`${classes.label} add_section`}>
              <Text translation="form.builder.add.section" />
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          pb={1.875}
          pl={1.875}
          alignItems="center"
        >
          <Box component="span">
            <IconButton size="small">
              <PlusIcon />
            </IconButton>
          </Box>
          <Box component="span" pl={0.5}>
            <Typography className={`${classes.label} add_section`}>
              <Text translation="form.builder.add.subsection" />
            </Typography>
          </Box>
        </Box>
      </> */}
    </Box>
  );
};
// ToDo: It will be implemented after completing the left side panel.
export default Bookmarks;
