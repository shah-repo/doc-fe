import { Box } from "@material-ui/core";
import { Formik } from "formik";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { documentTypeActions, documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevision, UpdateFormFieldMapping } from "../../../../../state/ducks/documentRevisions/types";
import { FormContext } from "../../../../components/forms/FormContext";
import { FBSchemaProps } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import ChangeDocumentFormPresenter from "./ChangeDocumentForm.presenter";
import { toFieldInitialValues, toUpdateFormRequestBody } from "./utils/transform";

interface Props {
  documentTypeId: string;
  docRevId: string;
  sourceSchema: FBSchemaProps[];
}

const mockTemplateResponse = [
  {
    sourceId: "first-form-1-kqqk3jz2",
    targetId: "second-form-2-kqqk580e",
  },
];
const ChangeDocumentFormContainer: React.FunctionComponent<Props> = ({
  documentTypeId,
  docRevId,
  sourceSchema,
}) => {
  const [template, setTemplate] = useState<UpdateFormFieldMapping[]>([]);
  const [availableFields, setFields] = useState<FBSchemaProps[]>([]);
  const async = useAsync();
  const updateFormAsync = useAsync({
    onSuccess: (data?: DocumentRevision) => {
      if (!data) {
        return;
      }
      window.open(
        `/document_revision/${data.document.id}/version/${data.id}`,
        "_self"
      );
    },
  }
  );
  console.log(template);

  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const updateFormAction = useActionCreator(documentRevisionsActions.updateForm);
  const availableForms = useSelector(documentTypeSelectors.docRevTypeForms);

  const onSubmit = (values) => {
    updateFormAsync.start(
      updateFormAction,
      docRevId,
      toUpdateFormRequestBody(values),
      updateFormAsync);
  };
  const handleFormChange = (value) => {
    const chosenFormSchema = find(availableForms, (form) => form.id === value.value)?.formTemplate?.schema || [];
    setTemplate(mockTemplateResponse);
    setFields(chosenFormSchema);
  };

  const generateInitialValues = () => {
    const base = { changeDocumentForm: { label: "", value: "" } };
    if (!mockTemplateResponse) {
      return base;
    }
    return { ...base, ...toFieldInitialValues(mockTemplateResponse, sourceSchema) };
  };

  useEffect(() => {
    async.start(getDocRevByIds, documentTypeId, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypeId]);

  return (
    <Box display="flex">
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          initialValues={generateInitialValues()}
          onSubmit={onSubmit}
        >
          <ChangeDocumentFormPresenter {...{ availableForms, handleFormChange, availableFields, sourceSchema }}/>
        </Formik>
      </FormContext.Provider>
    </Box>

  );
};

export default ChangeDocumentFormContainer;
