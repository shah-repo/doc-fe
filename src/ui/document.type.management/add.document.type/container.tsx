import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import * as Yup from "yup";
import Config from "../../../config";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { requiredSchema } from "../../components/forms/fields/validators";
import { toastError } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { DialogHandler } from "../../hooks/useDialog";
import DocumentTypeFormPresenter from "../form/presenter";
import { toDocumentTypeBody } from "../transform";

interface Props {
  dialog: DialogHandler;
}

const AddDocumentTypeFormContainer: React.FunctionComponent<Props> = ({
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
    startingNumber: 1,
    hiddenForCreationForUsersWithoutTags: null,
    group: "",
    category: null,
    schema: null,
    fieldsConfig: null,
    defaultRevStage: null,
  };

  const addDocumentTypeAction = useActionCreator(documentTypeActions.addDocumentType);
  const disabled = Config.isProduction || Config.isDemo;
  const async = useAsync({
    onSuccess: () => {
      dialog.close();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const onSubmit = (values: any) => {
    async.start(
      addDocumentTypeAction,
      toDocumentTypeBody(values),
      async,
    );
  };

  const AddDocumentTypeSchema = Yup.object().shape({
    documentTypeName: requiredSchema,
    documentTypeAcronym: requiredSchema,
    group: requiredSchema,
  });

  const render = (props: FormikProps<any>) => (
    <DocumentTypeFormPresenter
      handleTransition={dialog.close}
      transitionLabel={"common.close"}
      disabled={disabled}
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
        <Text translation={"common.add.document.type"} />
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
          validationSchema={AddDocumentTypeSchema}
        >
          {render}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentTypeFormContainer;
