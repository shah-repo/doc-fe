import { Box, IconButton, Typography } from '@material-ui/core';
import copy from 'copy-to-clipboard';
import _debounce from 'lodash/debounce';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SM } from '../../../App';
import { ReactComponent as CopyIcon } from '../../../assets/images/copy_outlined.svg';
import { TabInfo } from '../../../state/ducks/documentRevisions/documentType/types';
import { FB, FBBookmarkItem, FBMapWrapper, FBTooltip } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import { styles } from './Bookmarks.new.styles';

const Bookmarks: React.FC<{ tabConfig: TabInfo[] }> = ({ tabConfig }) => {
  const history = useHistory();
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const { _tabsState } = SM.useStores();
  const [selectedBookmarkName, setSelectedBookmarkName] = useState<string>();
  const [bookmarks, setBookmarks] = useState<FBBookmarkItem[]>([]);
  const updateBookmarks = _debounce(setBookmarks, 500);

  SM.reaction(
    () => bookmarkState?.bookmarks ?? [],
    updateBookmarks,
  );

  const handleBookmarkClick = ({ name = '', tabId }: FBBookmarkItem) => {
    setSelectedBookmarkName(name);

    if (tabId) {
      _tabsState?.setActiveTabId(tabId);
    }

    history.push(`#${name}`);
  };

  return (
    <Box m={1.875}>
      <FBMapWrapper<FBBookmarkItem[]>
        collection={bookmarks.sort(
          (a, b) => tabConfig.findIndex(tab => tab.tabId === a.tabId) - tabConfig.findIndex(tab => tab.tabId === b.tabId))}>
        {(bookmark: FBBookmarkItem, index: number) => {
          const { name = '', label = '' } = bookmark;
          const link = window.location.href.split('#');
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
                    style={{ fontWeight: selectedBookmarkName === name ? 500 : 'normal' }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
              <FBTooltip title="common.copy.link">
                <IconButton
                  className={classes.iconButton}
                  size="small"
                  onClick={() => copy(`${link[0]}#${name}`)}
                >
                  <CopyIcon />
                </IconButton>
              </FBTooltip>
            </Box>
          );
        }}
      </FBMapWrapper>
    </Box>
  );
};

export default Bookmarks;
