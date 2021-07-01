import React from "react";
import useDialog from "../../../../hooks/useDialog";
import ChangeDocumentFormPresenter from "./ChangeDocumentForm.presenter";


const ChangeDocumentFormContainer: React.FunctionComponent<{}> = ({

}) => {
  const dialog = useDialog();
  return (
    <ChangeDocumentFormPresenter {...{ dialog }}/>
  );
};

export default ChangeDocumentFormContainer;
