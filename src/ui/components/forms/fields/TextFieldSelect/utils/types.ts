import { Translation } from "../../../../../translations/types";
import { FormikHybridFieldProps } from "../../../../hoc/utils/types";
import { OptionType } from "../../Autocomplete/types";

interface TextFieldSelectOptions extends OptionType {
  disabled: boolean;
}

export interface TextFieldSelectProps extends FormikHybridFieldProps {
  name?: string;
  label?: Translation | string;
  value?: string;
  gutter?: boolean;
  handleChange?: (event: React.ChangeEvent<{ value: unknown }>) => any;
  options?: TextFieldSelectOptions[];
}
