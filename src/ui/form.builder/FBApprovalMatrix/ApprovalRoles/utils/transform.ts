import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";

export const toOptions = (values: any[]): OptionType[] => values.map((value) => ({
  label: value.name,
  value: value.id,
}));
