import React, { Fragment } from "react";
import useDialog from "../../hooks/useDialog";
import Dialog from "./Dialog.container";
import { styles } from "./utils/DialogOpener.styles";
import { DialogOpenerProps } from "./utils/types";

type Props = DialogOpenerProps;

const DialogOpener: React.FunctionComponent<Props> = ({
  id, text,
}) => {
  const classes = styles();
  const dialogHandler = useDialog();
  const openDialog = () => dialogHandler.open();

  return (
    <Fragment>
      <div
        className={classes.container}
        onClick={openDialog}
      >
        {text}
      </div>
      <Dialog
        auditId={id}
        dialogHandler={dialogHandler}
      />
    </Fragment>
  );
};

DialogOpener.displayName = "TextDiffDialogOpener";

export default DialogOpener;
