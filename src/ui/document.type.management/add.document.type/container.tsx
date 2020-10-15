import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { toastError } from "../../components/notifications";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { DialogHandler } from "../../hooks/useDialog";
import DocumentTypeFormPresenter from "../form/presenter";
import { toDocumentTypeBody } from "../transform";

interface Props {
  dialog: DialogHandler;
}

export const AddDocumentTypeFormContainer: React.FunctionComponent<Props> = ({
  dialog,
}) => {
  const initialValues = {
    documentTypeName: "",
    documentTypeAcronym: "",
    privateNumberPool: false,
    canRedLine: false,
    isQms: false,
    needsSignature: false,
    defaultTraining: false,
    startingNumber: "",
    hiddenForCreationForUsersWithoutTags: null,
    group: "",
    category: null,
    schema: null,
    fieldsConfig: null,
  };

  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
    },
  });
  const addDocumentTypeAction = useActionCreator(documentTypeActions.addDocumentType);

  const onSubmit = (values: any) => {
    async.start(
      addDocumentTypeAction,
      toDocumentTypeBody(values),
      async,
    );
  };

  const render = (props: FormikProps<any>) => (
    <DocumentTypeFormPresenter
      handleTransition={dialog.close}
      transitionLabel={"Close"}
      {...props}
    />
  );

  return (
    <Dialog
      open={dialog.isOpen}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>
        Add a document type
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </DialogContent>

    </Dialog>

  );
};

export default AddDocumentTypeFormContainer;
