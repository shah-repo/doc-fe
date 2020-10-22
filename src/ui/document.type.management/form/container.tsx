import { Formik, FormikProps } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { DocumentType, documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { toastError } from "../../components/notifications";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { toDocumentTypeBody, toDocumentTypeIntialValues } from "../transform";
import DocumentTypeFormPresenter from "./presenter";

interface Props {
  documentType: DocumentType;
}

export const DocumentTypeFormContainer: React.FunctionComponent<Props> = ({
  documentType,
}) => {
  const dispatch = useDispatch();
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
    },
  });

  const { id } = documentType;
  const initialValues = toDocumentTypeIntialValues(documentType);
  const transitionLabel =  "common.delete";

  const updateDocumentTypeAction = useActionCreator(documentTypeActions.updateDocumentType);

  const onSubmit = (values) => {
    async.start(
      updateDocumentTypeAction,
      id,
      toDocumentTypeBody(values),
      async,
    );
  };
  const handleTransition = () => {
    dispatch(documentTypeActions.deleteDocumentType(id));
  };

  const render = (props: FormikProps<any>) => (
    <DocumentTypeFormPresenter
      {...{ handleTransition, transitionLabel }}
      {...props}
    />
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {render}
    </Formik>
  );
};

export default DocumentTypeFormContainer;
