import { DocumentTypeByIdForm } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { UpdateFormRequestBody } from "../../../../../state/ducks/documentRevisions/types";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";

export const toOptions = (forms: DocumentTypeByIdForm[]): OptionType[] =>
  forms.map((form) => ({
    label: form.name,
    value: form.id,
  })
  );

export const toUpdateFormRequestBody = (values: any): UpdateFormRequestBody => ({
  mapping: [],
  formToBeUsed: {
    id: values.changeDocumentForm.value,
  },
});

