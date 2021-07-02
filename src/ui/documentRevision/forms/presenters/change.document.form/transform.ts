import { DocumentTypeByIdForm } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";

export const toOptions = (forms: DocumentTypeByIdForm[]): OptionType[] =>
  forms.map((form) => ({
    label: form.name,
    value: form.id,
  })
  );
