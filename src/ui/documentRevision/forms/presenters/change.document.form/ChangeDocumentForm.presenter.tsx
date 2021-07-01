import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { DialogHandler } from "../../../../hooks/useDialog";
import ChangeDocumentFormDialog from "./dialog/ChangeDocumentFormDialog";

interface Props {
  dialog: DialogHandler;
}

const ChangeDocumentFormPresenter: React.FunctionComponent<Props> = ({
  dialog,
}) => (
  <>
    <Button
      variant="outlined"
      color="secondary"
      onClick={dialog.open}
      id="ChangeDocumentForm"
    >
      <Text translation="common.change.document.form"/>
    </Button>
    <ChangeDocumentFormDialog {...{ dialog }}/>
  </>
);

export default ChangeDocumentFormPresenter;
