import { Box, IconButton, Typography } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import { SM, SMBox } from '../../../../..';
import { ReactComponent as CloseIcon } from '../../../../../../assets/images/leftPanel/close.svg';
import Text from '../../../../../../ui/components/Text';
import { FB } from '../../../../../../ui/form.builder';
import LeftPanelFormEditor from './Components/LeftPanelFormEditor';
import ListPanel from './Components/ListPanel';
import useStyles from './DocumentRevisionLeftPanel.styles';

const DocumentRevisionLeftPanel: React.FunctionComponent = () => {
  const classes = useStyles();
  const { _documentRevisionFormState } = SM.useStores();
  const { leftPanelState } = FB.useStores();

  return (
    <Observer>
      {() => (
        <>
          {
            _documentRevisionFormState?.leftPanelOpen && (
              <Box className={classes.root}>
                <Box
                  ml={1.75}
                  display="flex"
                  height={45}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6" className={classes.titleText}>
                    <Text translation="form.builder.library" />
                  </Typography>
                  <IconButton
                    disableRipple
                    disableFocusRipple
                    onClick={_documentRevisionFormState?.setLeftPanelOpen}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <SMBox className={classes.list}>
                  <Observer>
                    {() => (<>
                      {(!leftPanelState?.showLeftPanelEditor || !leftPanelState) && <ListPanel />}
                      {leftPanelState?.showLeftPanelEditor && <LeftPanelFormEditor />}
                    </>)}
                  </Observer>
                </SMBox>
              </Box>
            )}
        </>
      )}
    </Observer>
  );
};

export default DocumentRevisionLeftPanel;
