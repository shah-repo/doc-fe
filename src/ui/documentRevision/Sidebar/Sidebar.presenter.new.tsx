import { Box, CircularProgress, IconButton } from '@material-ui/core';
import cx from 'classnames';
import { useObserver } from 'mobx-react';
import React from 'react';
import { SM } from '../../../App';
import { FB, FBTooltip } from '../../form.builder';
import useStyles from './styles.new';
import { Sidebar } from './types.new';

interface Props {
  isDrawerOpen: boolean
  indexNumber: number
  sidebarList: Sidebar[]
  inputRef: React.MutableRefObject<null>
  handleMenuIconClick: (index: number) => void
  onDrawerToggle: () => void
  loading?: boolean
}

const SidebarPresenter: React.FunctionComponent<Props> = ({
  isDrawerOpen,
  indexNumber,
  sidebarList,
  inputRef,
  handleMenuIconClick,
  loading,
}) => {
  const classes = useStyles(isDrawerOpen);
  const { bookmarkState } = FB.useStores();
  const { _documentRevisionSidebarState } = SM.useStores();

  _documentRevisionSidebarState?.setTitle(sidebarList[indexNumber].details.title);

  useObserver(() => {
    loading = bookmarkState?.loading;
  });

  return (
    <Box display="flex" height="100%" width="100%">
      <Box
        width={48}
        textAlign="center"
        className={classes.iconBar}
      >
        {sidebarList.map((item, index) =>
          item.details.shouldShow && (
            <Box key={item.details.title}>
              <FBTooltip placement="left" title={item.details.tooltip || item.details.title}>
                <IconButton
                  data-cy={item.details.dataCy !== undefined ? item.details.dataCy : `${item.type}-icon`}
                  ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
                  onClick={() => handleMenuIconClick(index)}
                  className={cx(classes.iconButtonNew, { [classes.bgIsActiveTab]: indexNumber === index })}
                >
                  {(!loading || item.type !== 'bookmarks') && item.icon}
                  {item.type === 'bookmarks' && loading && <CircularProgress size={18} />}
                </IconButton>
              </FBTooltip>
            </Box>
          ),
        )}
      </Box>
      <Box
        data-cy={`${sidebarList[indexNumber].details.title}-detail`}
        className={cx(classes.references, 'containing-box-scrollbar')}
      >
        {sidebarList[indexNumber].details.component}
      </Box>
    </Box>
  );
};

export default SidebarPresenter;
