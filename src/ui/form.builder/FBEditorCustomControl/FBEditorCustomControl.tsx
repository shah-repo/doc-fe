import { CircularProgress, IconButton, ListItem, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { FBEditorCustomControlProps, FBLeftPanelEditorState, FBMapWrapper } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../../ui/components/Text";
import styles from "./FBEditorCustomControl.styles";
import { withFBEditorCustomControl } from "./FBEditorCustomControl.wrap";

const FBEditorCustomControl: React.FunctionComponent<FBEditorCustomControlProps> = ({
  controls = [],
  loading,
  handleSelect,
  ...props
}) => {
  const classes = styles();
  return (
    <>
      {loading && <CircularProgress size={20} />}
      {!loading && (
        <FBMapWrapper<DocumentRevision> collection={controls}>
          {(control: DocumentRevision, i) => (
            <ListItem
              key={`form.builder.${control.id}-${i}`}
              data-cy={`form.builder.${control.name}-${i}`}
              className={`${classes.listItemStyle} ${
                controls.length - 1 === i ? "lastItem" : ""
              }`}
              onClick={() => handleSelect && handleSelect(control)}
            >
              <IconButton disableRipple={true}>
                {FBLeftPanelEditorState.editorTypeIconMapping.customcontrol &&
                React.createElement(
                  FBLeftPanelEditorState.editorTypeIconMapping.customcontrol
                )}
              </IconButton>
              <ListItemText key={i}>
                <Typography className={classes.listSubItem}>
                  <Text message={control.name} />
                </Typography>
              </ListItemText>
            </ListItem>
          )}
        </FBMapWrapper>
      )}
    </>
  );
};

export default withFBEditorCustomControl(FBEditorCustomControl);
