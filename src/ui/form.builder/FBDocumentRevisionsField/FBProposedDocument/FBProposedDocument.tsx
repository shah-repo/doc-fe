import { Box, Button, IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBSection, FBTextField } from "../..";
import { ReactComponent as RemoveDocument } from "../../../../assets/images/circle-delete.svg";
import Colors from "../../../layout/theme/utils/colors";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";
import { withFBProposedDocument } from "./FBProposedDocument.wrap";

const FBProposedDocument: React.FunctionComponent<FBProposedDocumentProps> = ({
  removeDocument,
  setMouseInside,
  handleOpen,
  justification,
  description,
  index = 0,
  isMouseInside,
  disabled = false,
  handleEdit,
  id,
}) => (
  <Box
    onMouseEnter={() => setMouseInside?.(!disabled)}
    onMouseLeave={() => setMouseInside?.(false)}
  >
    <FBSection label="common.document" stepIndex={index + 1} >
      <Box
        display="flex"
        flexDirection="row-reverse"
        mt={-3.5}
        visibility={isMouseInside ? "visible" : "hidden"}
      >
        <Button
          style={{ background: Colors.white, margin: 0, minWidth: 40 }}
          onClick={() => removeDocument?.(id)}
        >
          <RemoveDocument />
        </Button>
      </Box>
    </FBSection>
    <Box display="flex" alignItems="flex-end" mb={5} >
      <Box flexGrow={1}>
        <FBAutocompleteAsync
          optionId={FBAutocompleteAsyncOption.documentRevisions}
          label="common.document"
          gutter={false}
          disabled={true}
          defaultValue={id}
          freeSolo={true}
        />
      </Box>
      <Box
        bgcolor={Colors.medium_blue}
        borderRadius={3}
        color="white"
        height="80%"
        ml={1}
        mb={0.3}
      >
        <IconButton color="inherit" onClick={handleOpen} >
          <VisibilityIcon />
        </IconButton>
      </Box>
    </Box>

    <FBTextField
      label="common.description"
      dataCy="common.description"
      defaultValue={description}
      disabled={disabled}
      onChange={(e) => handleEdit ? handleEdit(e, index, "description") : null}
      rows={3}
      rules="required"
      name={`description-${index}`}
    />
    <FBTextField
      label="cr.justification"
      dataCy="cr.justification"
      defaultValue={justification}
      onChange={(e) => handleEdit ? handleEdit(e, index, "justification") : null}
      disabled={disabled}
      rows={3}rules="required"
      name={`justification-${index}`}
    />
  </Box>
);


export default withFBProposedDocument(FBProposedDocument);
