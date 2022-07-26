import { Box, IconButton, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SM, SMBox } from "../../../../..";
import { ReactComponent as CloseIcon } from "../../../../../../assets/images/leftPanel/close.svg";
import Text from "../../../../../../ui/components/Text";
import { FB } from "../../../../../../ui/form.builder";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import LeftPanelFormEditor from "./Components/LeftPanelFormEditor";
import ListPanel from "./Components/ListPanel";
import styles from "./DocumentRevisionLeftPanel.styles";

const DocumentRevisionLeftPanel: React.FunctionComponent = () => {
  const classes = styles();
  const { _documentRevisionFormState } = SM.useStores();
  const { leftPanelState } = FB.useStores();
  return (
    <Observer>
      {() => (
        <>
          {
            _documentRevisionFormState?.leftPanelOpen && (
              <Box
                height="100%"
                bgcolor={Colors.white}
                maxWidth={(!leftPanelState?.showLeftPanelEditor ||  !leftPanelState) ? "max-content" : 300}
                boxShadow= {`inset -1px 0px 0px ${Colors.lightest_grey1}`}
                zIndex={1202}
                marginTop={1.25}
              >
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
                <SMBox
                  display="flex"
                  justifyContent="center"
                  stretchY="calc(100vh - 86px)"
                  borderTop={1}
                  borderColor={Colors.gray_goose}
                >
                  <Observer>
                    {() => (<>
                      {(!leftPanelState?.showLeftPanelEditor ||  !leftPanelState) && <ListPanel />}
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
