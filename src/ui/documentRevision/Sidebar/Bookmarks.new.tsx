import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import copy from "copy-to-clipboard";
import { get, isUndefined } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SM } from "../../../App";
import { tooltipStyles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as CopyIcon } from "../../../assets/images/copy_outlined.svg";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../state/reducers";
import { DocTypeGroups } from "../../dashboard.new/line.items/common/types";
import { FB, FBBookmarkItem, FBDocTypeGroup, FBMapWrapper, FBTooltip } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./Bookmarks.new.styles";

interface SidebarPresenterProps {
  bookmarks?: FBBookmarkItem[];
  fromAR?: boolean;
}

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="top" classes={classes} {...props} />;
};

const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ bookmarks, fromAR }) => {
  const history = useHistory();
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const { _tabsState, _documentRevisionFormState } = SM.useStores();
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);

  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, (_documentRevisionFormState?.documentRevision?.id || "")));
  const docTypeGroup = get(documentRevision?.document?.documentType, "group", FBDocTypeGroup.OTHER);
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], "group");
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  const tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));

  useObserver(() => {
    bookmarks = bookmarkState?.bookmarks;
  });
  const bookmarkClick = (hash, index, tabIndex) => {
    setSelectedIndex(index);
    if (fromAR) {
      history.push(`#${hash}`);
    }
    if (isUndefined(tabIndex) || tabIndex < 0) {
      return;
    }
    if (tabConfig) {
      _tabsState?.setTabID(tabConfig[tabIndex]?.tabId);
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
      <FBMapWrapper<FBBookmarkItem[]>
        collection={bookmarks?.sort((a, b) => ((a?.name || "") > (b?.name || "")  ? 1 : -1)) || []}>
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
    </Box>
  );
};
export default Bookmarks;
