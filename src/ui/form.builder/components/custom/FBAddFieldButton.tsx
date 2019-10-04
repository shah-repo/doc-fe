import { Box, Button } from "@material-ui/core";
import { BoxProps } from "@material-ui/core/Box";
import React from "react";
import Text from "../../../components/Text";
import { withEditorDialog } from "../../hocs/withEditorDialog";
import FBEditorDialog from "../../main/editor/FBEditorDialog";
import { FBEditorDialogProps } from "../../types/editor";

type Props = FBEditorDialogProps & BoxProps;

const FBAddFieldButton: React.FunctionComponent<Props> = ({
  handleClick,
  ...props
}) => {

  return (
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
      <Button color="primary" fullWidth={true} size="medium" onClick={handleClick}>
        <Text translation="form.builder.add.field" />
      </Button>
      <Box
        borderTop={3}
        my="auto"
        height="1px"
        width="100%"
        color="primary.main"
      />
      <FBEditorDialog {...props} />
    </Box>
  );
};

export default withEditorDialog(FBAddFieldButton);
