import { Box, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionLeftPanelProps, SMBox } from "../../../../..";
import Text from "../../../../../../ui/components/Text";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import LeftPresenter from "./Components/presenter";
import styles from "./DocumentRevisionLeftPanel.styles";
import { withDocumentRevisionLeftPanelWrap } from "./DocumentRevisionLeftPanel.wrap";

const DocumentRevisionLeftPanel: React.FunctionComponent<
  DocumentRevisionLeftPanelProps
> = ({
  _documentRevisionFormState,
  _documentRevisionLeftPanelState,
  title,
}) => {
  const classes = styles();
  return (
    <Observer>
      {() => (
        <Box
          height="100%"
          bgcolor="white"
          width={_documentRevisionFormState?.leftPanelOpen ? 300 : 55}
          borderColor={Colors.medium_gray}
          borderLeft={0.5}
          style={{
            transition: _documentRevisionFormState?.leftPanelOpen
              ? "all .2s ease-in-out"
              : " all .2s ease-in-out",
          }}
        >
          <Box
            pl={1}
            display="flex"
            height={45}
            alignItems="center"
            justifyContent="space-between"
          >
            {_documentRevisionFormState?.leftPanelOpen && (
              <Typography className={classes.titleText}>
                <Text translation="form.builder.library" />
              </Typography>
            )}
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={_documentRevisionFormState?.setLeftPanelOpen}
            >
              {_documentRevisionFormState?.leftPanelOpen && <CloseIcon />}
              {!_documentRevisionFormState?.leftPanelOpen && (
                <KeyboardBackspaceIcon />
              )}
            </IconButton>
          </Box>
          {_documentRevisionFormState?.leftPanelOpen && (
            <SMBox
              display="flex"
              justifyContent="center"
              stretchY="calc(100vh - 86px)"
              borderTop={1}
              borderColor={Colors.medium_gray}
            >
              <LeftPresenter />
            </SMBox>
          )}
        </Box>
      )}
    </Observer>
  );
};

export default withDocumentRevisionLeftPanelWrap(DocumentRevisionLeftPanel);
