import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import copy from "copy-to-clipboard";
import { useObserver } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
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
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);
  useObserver(() => {
    bookmarks = bookmarkState?.bookmarks;
  });
  return (
    <Box m={1.875}>
      <FBMapWrapper<FBBookmarkItem[]> collection={bookmarks || []}>
        {(bookmark: FBBookmarkItem, index, arr) => {
          const { name: hash, label = "" } = bookmark;
          const link = window.location.href.split("#");
          return (
            <Box
              display="flex"
              mb={1.875}
              alignItems="center"
              key={`fb-bookmark-${hash}-${index}`}
            >
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
                    <Typography className={classes.label}>{label}</Typography>
                  </Box>
                </Link>
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
