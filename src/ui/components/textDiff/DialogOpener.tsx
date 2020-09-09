import React, { Fragment, useMemo } from "react";
import useDialog from "../../hooks/useDialog";
import Dialog from "./Dialog.container";
import { styles } from "./utils/DialogOpener.styles";
import { DialogOpenerProps } from "./utils/types";

type Props = DialogOpenerProps;

const DialogOpener: React.FunctionComponent<Props> = ({
  id,
  text,
  dataCy,
}) => {
  const textToShow = useMemo(() => {
    if (!text) {
      return "N/A";
    }
    if (text.trim().length === 0) {
      return "N/A";
    }

    return text;
  }, [text]);
  const classes = styles();
  const dialogHandler = useDialog();
  const openDialog = () => dialogHandler.open();

  return (
    <Fragment>
      <div
        data-cy={dataCy}
        className={classes.container}
        onClick={openDialog}
      >
        {textToShow}
      </div>
      {
        dialogHandler.isOpen &&
        <Dialog
          auditId={id}
          dialogHandler={dialogHandler}
        />
      }
    </Fragment>
  );
};

DialogOpener.displayName = "TextDiffDialogOpener";

export default DialogOpener;
