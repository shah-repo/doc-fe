import { Box, IconButton } from "@material-ui/core";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import { FB, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDocumentRevisionsItemProps, FBSection, FBTextField } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBDocumentRevisionsItem: React.FunctionComponent<FBDocumentRevisionsItemProps> = ({
  handleOpen,
  remove,
  id,
  index = 0,
  disabled,
  name,
}) => (
  <>
    <FBSection
      label="form.builder.document"
      stepIndex={index + 1}
      bookmarked={false}
      name={`fb-docrev-section-${name}-${id}`}
    >
      <Box
        display="flex"
        flexDirection="row-reverse"
        visibility={disabled ? "hidden" : "visible"}
        mt={-3.5}
      >
        <IconButton
          style={{ background: Colors.white, borderRadius: 3, minWidth: 40 }}
          onClick={() => remove?.(index)}
          size="small"
        >
          <RemoveCircleOutlineOutlinedIcon fontSize="small" color="error" />
        </IconButton>
      </Box>
    </FBSection>
    <FBTextField
      name={`${name}.${index}.id`}
      defaultValue={FB.uniqid}
      hidden={true}
    />
    <Box display="flex" alignItems="flex-end" mb={5} >
      <Box flexGrow={1}>
        <FBAutocompleteAsync
          name={`${name}.${index}.proposedDocumentRevision.id`}
          optionId={FBAutocompleteAsyncOption.documentRevisions}
          label="form.builder.document"
          gutter={false}
          disabled={true}
          freeSolo={true}
          shouldReloadOnInit
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
        <IconButton color="inherit" onClick={() => handleOpen?.(index)} >
          <VisibilityIcon />
        </IconButton>
      </Box>
    </Box>
    <FBTextField
      name={`${name}.${index}.descriptionOfChange`}
      label="form.builder.description.of.change"
      dataCy="common.description"
      {...{ disabled }}
      rules="required"
      rows={3}
    />
    <FBTextField
      name={`${name}.${index}.justificationOfChange`}
      label="form.builder.justification.of.change"
      dataCy="cr.justification"
      {...{ disabled }}
      rules="required"
      rows={3}
    />
  </>
);

export default FBDocumentRevisionsItem;
