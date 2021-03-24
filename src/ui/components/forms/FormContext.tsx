import { useFormikContext } from "formik";
import { filter, isEmpty, isEqual, keys, map, omit } from "lodash";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../state/ducks/company";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, ReferenceToEditRequest, RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentRecord } from "../../documentRevision/helpers/checkDocumentGroup";
import { FB, FBAutocompleteAsyncOption } from "../../form.builder";
import FBAutocompleteAsyncStore from "../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store";
import { SubmitFormRelation } from "./FormContext.types";

export const FormContext = React.createContext({ submitOnChange: false });

export const useFormContext = () => {
  const context = useContext(FormContext);
  const formik = useFormikContext();
  const { workspaceState, formState, schemaState } = FB.useStores();
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  let isRecord;
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
        isRecord = checkIsDocumentRecord(values.document?.documentType?.groupOptions);
        if (values.revisionChangeType === RevisionChangeType.Obsolete && isRecord) {
          const newInput = {};
          keys(values.formInput).map((key) => {
            newInput[key] = values?.formInput && typeof values?.formInput[key] === "string" && key !== "equipment_id"
              ? "Void"
              : key === "equipment_id" ?  null : values?.formInput?.[key];
            return key;
          });
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput", omit(newInput, ["partType", "childForRevise"]));
        } else {
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput", omit(formState?.getValues(), ["partType", "childForRevise"]));
        }
        if (isOutputSchema()) {
          formik.setFieldValue("schema", workspaceState.schema);
        }
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }

  function setReferences(relation: SubmitFormRelation) {
    if (!workspaceState) { return; }
    const { type, name, prevValue, nextValue } = relation;
    const prevDocument: DocumentRevision | undefined =
      FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.POList, prevValue);
    const nextDocument: DocumentRevision | undefined =
      FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.POList, nextValue);
    const prevValueId = prevDocument?.document.id;
    const nextValueId = nextDocument?.document.id;
    let refValues = workspaceState.referenceValue;
    if (!prevValueId) {
      // special case: when prevValue is undefined and there is a value in formInput,
      // we need to remove it from refereces also,
      // made according to issues with autosave(caused by this to other fields)
      const currentPoReference = workspaceState?.document?.formInput?.[name];
      const refWithoutPrevValue = workspaceState?.document?.referenceTo.filter((e) => {
        const docRevIds = e.documentRevisions?.map((i) => i.id );
        if (docRevIds?.includes(currentPoReference)) {
          return null;
        }
        return e;
      });
      if (!isEmpty(refWithoutPrevValue)) {
        refValues = refWithoutPrevValue?.map((e) => ({ id: e.id }))as ReferenceToEditRequest[];
      }
      formik.setFieldValue("referenceTo", [...refValues, { id: nextValueId }]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      workspaceState.referenceValue = [...refValues, { id: nextValueId! }];
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
      refValues = filter(refValues, (ref) => ref.id !== prevValueId);
    }
    if (nextValueId) {
      formik.setFieldValue("referenceTo", [...refValues, { id: nextValueId }]);
      workspaceState.referenceValue = [...refValues, { id: nextValueId }];
      return;
    }
    formik.setFieldValue("referenceTo", refValues);
  }

  const submitForm = (relation?: SubmitFormRelation) => {
    if (!autosaveEnabled) {
      return;
    }

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
