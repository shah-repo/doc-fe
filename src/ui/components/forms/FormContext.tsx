import { useFormikContext } from "formik";
import { isEqual } from "lodash";
import React, { useContext } from "react";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { FB } from "../../form.builder";

export const FormContext = React.createContext({ submitOnChange: false });

export const useFormContext = () => {
  const context = useContext(FormContext);
  const formik = useFormikContext();
  const { workspaceState, formState } = FB.useStores();

  function isOutputSchema(): boolean {
    const values = formik.values as any;
    const { schema: documentSchema = [] } = values?.formDocument?.formTemplate || {};
    return (
      (values?.document?.documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA)) &&
      !isEqual(JSON.stringify(workspaceState?.schema), JSON.stringify(documentSchema))
    );
  }

  function setFBValue() {
    const values = formik.values as any;
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values.outputDocumentTypes || [])
            .map((outputDoc) => ({ id: outputDoc.value }) ),
          schema: workspaceState?.getSchema(),
        });
        break;
      case "form":
      case "formDesign":
        formik.setFieldValue("formDocument", {
          id: values.formDocument?.id,
        });
        formik.setFieldValue("formInput", formState?.getValues());
        if (workspaceState.mode === "formDesign" && isOutputSchema()) {
          formik.setFieldValue("schema", workspaceState.schema);
        }
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }
  // TODO: check if this param is needed. Formik context should be available
  const submitForm = () => {
    if (context.submitOnChange) {
      if (workspaceState) {
        setFBValue();
      }
      formik.submitForm();
    }
  };

  return {
    ...context,
    submitForm,
  };
};
