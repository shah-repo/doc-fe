import { FieldProps } from "formik";
import { Translation } from "../../../../../translations/types";
import { SelectOption } from "../../Select";

export interface EditableSelectFieldProps {
  name: string;
  label?: Translation | string;
  options?: SelectOption[];
  includeEmpty?: boolean;
  value?: string;
  handleChange?: (event: React.ChangeEvent<{ value: unknown }>) => any;
}

export type EditableSelectContainerProps = EditableSelectFieldProps & FieldProps;
