import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import AddGroup from "./AddGroup";

interface OwnProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export type Props = OwnProps;

export const AddGroupPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => {
  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        onClick={openDialog}
        id="AddGroupPresenter-openDialog"
        style={{ margin: 0 }}
      >
        <Text message="group.management.add.group" />
      </Button>
        <AddGroup
            isOpen={isOpen}
            closeDialog={closeDialog}
            title={<Text translation={"group.management.create.group"} />}
        />
    </Box>
  );
};

export default AddGroupPresenter;
