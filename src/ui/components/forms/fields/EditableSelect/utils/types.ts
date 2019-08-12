import { Translation } from "../../../../../translations/types";
import { FormikHybridFieldProps } from "../../../../hoc/utils/types";
import { SelectOption } from "../../Select";

export interface EditableSelectFieldProps extends FormikHybridFieldProps {
  label?: Translation | string;
  options?: SelectOption[];
  includeEmpty?: boolean;
  value?: string;
  handleChange?: (event: React.ChangeEvent<{ value: unknown }>) => any;
}

export type EditableSelectContainerProps = EditableSelectFieldProps;
