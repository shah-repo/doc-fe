import { useFormikContext } from "formik";
import { filter, isEqual, map } from "lodash";
import React, { useContext } from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { FB, FBAutocompleteAsyncOption } from "../../form.builder";
import FBAutocompleteAsyncStore from "../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store";
import { SubmitFormRelation } from "./FormContext.types";

export const FormContext = React.createContext({ submitOnChange: false });

export const useFormContext = () => {
  const context = useContext(FormContext);
  const formik = useFormikContext();
  const { workspaceState, formState, schemaState } = FB.useStores();

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

  function setReferences(relation: SubmitFormRelation) {
    const { type, name, prevValue, nextValue } = relation;
    const prevDocument: DocumentRevision | undefined =
      FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.POList, prevValue);
    const nextDocument: DocumentRevision | undefined =
      FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.POList, nextValue);
    const prevValueId = prevDocument?.document.id;
    const nextValueId = nextDocument?.document.id;
    let refValues = (formik.values as any).referenceTo;
    if (!prevValueId) {
      formik.setFieldValue("referenceTo", [...refValues, { id: nextValueId }]);
      return;
    }
    const poNames = schemaState?.getNamesByType(type);
    const values: string[] = [];
    // Check for other poreceive values
    map(formState?.getValues(), (id: string, key) => {
      if (key === name) { return; }
      if (!poNames?.includes(key)) { return; }
      const docRev: DocumentRevision | undefined =
        FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.POList, id);
      const { document: { id: docId = undefined } = {} } = docRev || {};
      if (!docId) { return; }
      values.push(docId);
    });
    if (!values.includes(prevValueId)) {
      refValues = filter(refValues, (ref) => ref.value !== prevValueId);
    }
    if (nextValueId) {
      formik.setFieldValue("referenceTo", [...refValues, { id: nextValueId }]);
      return;
    }
    formik.setFieldValue("referenceTo", refValues);
  }

  // TODO: check if this param is needed. Formik context should be available
  const submitForm = (relation?: SubmitFormRelation) => {
    if (context.submitOnChange) {
      if (workspaceState) {
        setFBValue();
      }
      if (relation) {
        if (relation.type === "poreceive") {
          setReferences(relation);
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
