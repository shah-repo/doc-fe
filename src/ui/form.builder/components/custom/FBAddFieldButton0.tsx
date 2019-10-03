import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { withEditorDialog } from "../../hocs/withEditorDialog";
import FBEditorDialog from "../../main/editor/FBEditorDialog";
import { FBEditorDialogProps } from "../../types/editor";

const FBAddFieldButton0: React.FunctionComponent<FBEditorDialogProps> = ({
  handleClick,
  ...props
}) => {

  return (
    <Box
      display="flex"
      my={1}
      border={1}
      style={{ borderStyle: "dashed" }}
    >
      <Button
        color="primary"
        size="medium"
        fullWidth={true}
        onClick={handleClick}
      >
        <Text translation="form.builder.add.field" />
      </Button>
      <FBEditorDialog {...props} />
    </Box>
  );
};

export default withEditorDialog(FBAddFieldButton0);
