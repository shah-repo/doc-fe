import { Box, Menu, MenuItem } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBMapWrapper, FBOption, FBTextEditorOptionsProps } from "..";
import { withFBTextEditorOptions } from "./FBTextEditorOptions.wrap";

const FBTextEditorOptions: React.FunctionComponent<FBTextEditorOptionsProps> = ({
  handleButtonClick,
  onOptionsChange,
  menuAnchorElement,
  menuVisible = false,
  options,
}) => (
  <Box display="block">
    <FBButton
      label="form.builder.description.options"
      color="default"
      endIcon={<ArrowDropDownIcon />}
      variant="outlined"
      size="small"
      onClick={handleButtonClick}
      style={{ textTransform: "inherit" }}
    />
    <Menu
      open={menuVisible}
      anchorEl={menuAnchorElement}
      keepMounted
    >
      <FBMapWrapper<FBOption[]> collection={options as FBOption[]}>
        {(option: FBOption, index) => (
          <MenuItem
            key={`fb-texteditor-option-${option.value}-${index}`}
            onClick={() => onOptionsChange?.(option.text)}
          >
            {option.text}
          </MenuItem>
        )}
      </FBMapWrapper>
    </Menu>
  </Box>
);

export default withFBTextEditorOptions(FBTextEditorOptions);
