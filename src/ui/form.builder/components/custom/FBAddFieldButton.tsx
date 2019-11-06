import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import editorStore from "../../stores/FBEditorStore";
import { FBEditorWrapperProps } from "../../types/editor";

const FBAddFieldButton: React.FunctionComponent<FBEditorWrapperProps> = ({
  index = 0,
  ...props
}) => (
  <Box
    display="flex"
    mt={-4}
    {...props}
  >
    <Box
      borderTop={3}
      my="auto"
      height="1px"
      width="100%"
      color="primary.main"
    />
    <Button
      color="primary"
      fullWidth={true}
      size="medium"
      onClick={editorStore.setOpen(index)}
    >
      <Text translation="form.builder.add.field" />
    </Button>
    <Box
      borderTop={3}
      my="auto"
      height="1px"
      width="100%"
      color="primary.main"
    />
  </Box>
);

export default FBAddFieldButton;
