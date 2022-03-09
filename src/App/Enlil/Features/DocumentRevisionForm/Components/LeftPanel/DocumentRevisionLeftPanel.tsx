import { Box, IconButton, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionLeftPanelProps, SMBox, SMText } from "../../../../..";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import LeftPresenter from "./Components/presenter";
import { withDocumentRevisionLeftPanelWrap } from "./DocumentRevisionLeftPanel.wrap";

const DocumentRevisionLeftPanel: React.FunctionComponent<DocumentRevisionLeftPanelProps> = ({
  _documentRevisionFormState,
  _documentRevisionLeftPanelState,
  title,
}) =>  (
  <Observer>
    {() => (
      <Box
        height="100%"
        bgcolor="white"
        width={_documentRevisionLeftPanelState?.open ? 300 : 55}
        borderColor={Colors.medium_gray}
        borderLeft={0.5}
        style={{
          transition: _documentRevisionLeftPanelState?.open ? "all .2s ease-in-out" : " all .2s ease-in-out",
        }}
      >
        <Box
          display="flex"
          height={56}
          alignItems="center"
        >
          <IconButton onClick={_documentRevisionLeftPanelState?.setOpen}>
            {_documentRevisionLeftPanelState?.open && <KeyboardTabIcon />}
            {!_documentRevisionLeftPanelState?.open && <KeyboardBackspaceIcon />}
          </IconButton>
          {_documentRevisionLeftPanelState?.open && (
            <Typography variant="button">
              <SMText
                boxProps={{ flexGrow: 1, ml: 2, fontSize: "button" }}
                label={title || _documentRevisionLeftPanelState.title}
              />
            </Typography>
          )}
        </Box>
        <SMBox
          display="flex"
          p={0.5}
          stretchY="calc(100% - 56px)"
          borderTop={1}
          borderColor={Colors.medium_gray}
        >
          <LeftPresenter/>
        </SMBox>
      </Box>
    )}
  </Observer>
);

export default withDocumentRevisionLeftPanelWrap(DocumentRevisionLeftPanel);
