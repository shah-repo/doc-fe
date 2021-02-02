import { useFormikContext } from "formik";
import { find, isEqual } from "lodash";
import React, { useContext } from "react";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { ReferenceToEditRequest } from "../../../state/ducks/documentRevisions/types";
import { FB } from "../../form.builder";
import { SubmitFormRelation } from "./FormContext.types";

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
  const submitForm = (relation?: SubmitFormRelation) => {
    if (context.submitOnChange) {
      if (workspaceState) {
        setFBValue();
      }
      if (relation) {
        const type = find(workspaceState?.schema, { name: relation.name })?.type;
        if (type === "poreceive") {
          const currentPoReference = workspaceState?.document?.formInput?.[relation.name || ""];
          const refWithoutPrevValue = workspaceState?.document?.referenceTo.filter((e) => {
            const docRevIds = e.documentRevisions?.map((i) => i.id );
            if (docRevIds?.includes(currentPoReference) || docRevIds?.includes(relation.prevValue)) {
              return null;
            }
            return e;
          });
          const oldReferences = refWithoutPrevValue?.map((e) => ({ id: e.id }))as ReferenceToEditRequest[];
          formik.setFieldValue("referenceTo", [...oldReferences, { id: relation.nextValue }]);
        }
      }
      formik.submitForm();
    }
  };

  return {
    ...context,
    submitForm,
  };
};
