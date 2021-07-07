import { filter, find, keyBy, map, omit } from "lodash";
import { DocumentTypeByIdForm } from "../../../../../../state/ducks/documentRevisions/documentType/types";
import { UpdateFormFieldMapping, UpdateFormRequestBody } from "../../../../../../state/ducks/documentRevisions/types";
import { OptionType } from "../../../../../components/forms/fields/Autocomplete/types";
import { FBSchemaProps } from "../../../../../form.builder";
import { MigrationSpecialFields } from "./constants";

export const toFormOptions = (forms: DocumentTypeByIdForm[]): OptionType[] => forms.map((form) => ({
  label: `${form.document.docId} - ${form.name}`,
  value: form.id,
})
);

export const toFieldInitialValues = (fields: UpdateFormFieldMapping[], sourceSchema: FBSchemaProps[] ): any => {
  const transformed = map(fields, (field) => {
    const label = find(sourceSchema, (x) => x.name === field.sourceId)?.label;
    return {
      label,
      value: field.sourceId,
      targetId: field.targetId,
    };
  });
  return keyBy(transformed, "targetId");
};

const checkSpecialFields = (item, targetField) => {
  switch (item.type) {
    case MigrationSpecialFields.AUTOCOMPLETE:
      // Autocomple options must match
      return item.optionId === targetField.optionId;
    case MigrationSpecialFields.SELECT:
    case MigrationSpecialFields.CHECKBOX_GROUP:
    case MigrationSpecialFields.RADIO_GROUP: {
      // Target options must be a superset of source options
      const sourceValues = map(item.options as {value: string}[], ({ value }) => value);
      const targetValues = map(targetField.options as {value: string}[], ({ value }) => value);
      return sourceValues.every((val) => targetValues.includes(val));
    }
    default:
      return true;
  }
};

export const toFieldsOptions = (targetField: FBSchemaProps, sourceSchema: FBSchemaProps[] ): any => {
  const fieldsFilteredByType = filter(sourceSchema, (item) => {
    if (item.type !== targetField.type) {
      return false;
    }
    return checkSpecialFields(item, targetField);
  });

  return map(fieldsFilteredByType, (field) => {
    const label = find(sourceSchema, (x) => x.name === field.name)?.label;
    return {
      label,
      value: field.name,
      targetId: targetField.name,
    };
  });
};

export const toUpdateFormRequestBody = (values: any): UpdateFormRequestBody => {
  // Map only form fields
  const mappedFields: UpdateFormFieldMapping[] = map(omit(values, "changeDocumentForm"), (value) => ({
    targetId: value.targetId,
    sourceId: value.value,
  }));

  return ({
    mapping: mappedFields,
    formToBeUsed: {
      id: values.changeDocumentForm.value,
    },
  }); };

