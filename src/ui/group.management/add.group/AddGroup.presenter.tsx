import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import AddGroup from "./Group";

interface OwnProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

type Props = OwnProps;

export const AddGroupPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => (
  <Box>
    <Button
      color="primary"
      variant="contained"
      onClick={openDialog}
      id="Group-openDialog"
      data-cy="Group-openDialog"
      style={{ margin: 0 }}
    >
      <Text message="group.management.add.group" />
    </Button>
    <AddGroup
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={"group.management.create.group"}
      isCreateMode={true}
    />
  </Box>
);

export default AddGroupPresenter;
