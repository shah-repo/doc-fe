import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import useDialog from "../../hooks/useDialog";
import Dialog from "./Dialog";
import Text from "../Text";

interface OwnProps {
}

type Props = OwnProps;

const DialogButton: React.FunctionComponent<Props> = ({
}) => {
  const dialogHandler = useDialog();
  const openDialog = () => dialogHandler.open();

  return (
    <Fragment>
      <Button
        onClick={openDialog}
      >
        <Text translation="common.open" />
      </Button>
      <Dialog
        dialogHandler={dialogHandler}
      />
    </Fragment>
  );
}

DialogButton.displayName = "TextDiffDialogButton";

export default DialogButton;
