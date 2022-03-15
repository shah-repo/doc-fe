import { Box, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionLeftPanelProps, SMBox } from "../../../../..";
import Text from "../../../../../../ui/components/Text";
import { FB } from "../../../../../../ui/form.builder";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import LeftPanelFormEditor from "./Components/LeftPanelFormEditor";
import LeftPresenter from "./Components/presenter";
import styles from "./DocumentRevisionLeftPanel.styles";
import { withDocumentRevisionLeftPanelWrap } from "./DocumentRevisionLeftPanel.wrap";

const DocumentRevisionLeftPanel: React.FunctionComponent<
  DocumentRevisionLeftPanelProps
> = ({
  _documentRevisionLeftPanelState,
  _documentRevisionFormState,
  _formState,
}) => {
  const classes = styles();

  const { dialogState } = FB.useStores();
  return (
    <Observer>
      {() => (
        <>
          {(_formState?.mode === "design" ||
            _formState?.mode === "formDesign") &&
            _documentRevisionFormState?.leftPanelOpen && (
            <Box
              height="100%"
              bgcolor="white"
              width={300}
              borderColor={Colors.medium_gray}
              borderLeft={0.5}
            >
              <Box
                pl={1}
                display="flex"
                height={45}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography className={classes.titleText}>
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
                borderColor={Colors.medium_gray}
              >
                <Observer>
                  {() => (<>
                    {(!dialogState?.showLeftPanelEditor ||  !dialogState) && <LeftPresenter />}
                    {dialogState?.showLeftPanelEditor && <LeftPanelFormEditor />}
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

export default withDocumentRevisionLeftPanelWrap(DocumentRevisionLeftPanel);
