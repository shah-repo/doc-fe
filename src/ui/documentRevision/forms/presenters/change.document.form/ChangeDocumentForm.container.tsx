import { Box } from "@material-ui/core";
import { Formik } from "formik";
import { find, isEmpty, isNull, omitBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { documentTypeActions, documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevision, UpdateFormFieldMapping } from "../../../../../state/ducks/documentRevisions/types";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";
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
  sourceFormId: string;
}

const ChangeDocumentFormContainer: React.FunctionComponent<Props> = ({
  documentTypeId,
  docRevId,
  sourceSchema,
  sourceFormId,
}) => {
  const [template, setTemplate] = useState<UpdateFormFieldMapping[]>([]);
  const [availableFields, setFields] = useState<FBSchemaProps[]>([]);
  const [base, setBase] = useState<OptionType>({ label: "", value: "" });

  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const updateFormAction = useActionCreator(documentRevisionsActions.updateForm);
  const getFormMappingTemplateAction = useActionCreator(documentRevisionsActions.getFormMappingTemplate);
  const availableForms = useSelector(documentTypeSelectors.docRevTypeForms);

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

  const getFormMappingTemplateAsync = useAsync({
    onSuccess: (data?: any) => {
      if (!data) {
        return;
      }
      setTemplate(data.mapping);
    },
  }
  );

  const onSubmit = (values) => {
    if (!values.changeDocumentForm.value) {
      return;
    }
    // Omit by is used if user delets value from select because it returns null
    updateFormAsync.start(
      updateFormAction,
      docRevId,
      toUpdateFormRequestBody(omitBy(values, isNull)),
      updateFormAsync);
  };

  const handleFormChange = (value) => {
    const chosenForm = find(availableForms, (form) => form.id === value.value);
    const chosenFormSchema = chosenForm?.formTemplate?.schema || [];
    const targetFormId = chosenForm?.id;

    getFormMappingTemplateAsync.start(
      getFormMappingTemplateAction,
      sourceFormId,
      targetFormId,
      getFormMappingTemplateAsync);

    setFields(chosenFormSchema);
    setBase(value);
  };

  const generateInitialValues = () => {
    // Hack because enableReinitialize overrides chosen value
    const changeDocumentFormInitialValue = { changeDocumentForm: base };

    if (isEmpty(template)) {
      return changeDocumentFormInitialValue;
    }

    return {
      ...changeDocumentFormInitialValue,
      ...toFieldInitialValues(template, sourceSchema),
    };
  };

  useEffect(() => {
    // Fetching available forms for migration
    async.start(getDocRevByIds, documentTypeId, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypeId]);

  return (
    <Box display="flex">
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          initialValues={generateInitialValues()}
          onSubmit={onSubmit}
          enableReinitialize
        >
          <ChangeDocumentFormPresenter
            updateFormAsyncState={updateFormAsync.asyncState}
            {...{ availableForms, handleFormChange, availableFields, sourceSchema }}
          />
        </Formik>
      </FormContext.Provider>
    </Box>

  );
};

export default ChangeDocumentFormContainer;
