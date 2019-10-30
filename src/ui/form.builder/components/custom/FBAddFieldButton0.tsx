import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import editorStore from "../../stores/FBEditorStore";

const FBAddFieldButton0: React.FunctionComponent<{}> = () => (
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
      onClick={editorStore.setOpen()}
    >
      <Text translation="form.builder.add.field" />
    </Button>
  </Box>
);

export default FBAddFieldButton0;
