import React, { Fragment } from "react";
import useDialog from "../../hooks/useDialog";
import Dialog from "./Dialog";

interface OwnProps {
  id: string;
  text: string;
}

type Props = OwnProps;

const DialogOpener: React.FunctionComponent<Props> = ({
  id, text,
}) => {
  const dialogHandler = useDialog();
  const openDialog = () => dialogHandler.open();

  return (
    <Fragment>
      <span
        onClick={openDialog}
      >
        {text}
      </span>
      <Dialog
        auditId={id}
        dialogHandler={dialogHandler}
      />
    </Fragment>
  );
}

DialogOpener.displayName = "TextDiffDialogOpener";

export default DialogOpener;
