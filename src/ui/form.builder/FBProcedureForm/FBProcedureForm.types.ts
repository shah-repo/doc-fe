import { FBAutocompleteAsyncProps, FBFormProps, FBProcedureItemProps } from "..";
import { SelectOption } from "../../components/forms/fields/Select";
import FBProcedureFormState from "./FBProcedureForm.state";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "type">
& Pick<FBAutocompleteAsyncProps, "optionId" | "disabledOptions">
& {
  handleChangeOfPart?: () => void;
  handleChangeOfLot?: () => void;
  handleReloading?: () => void;
  partOptions?: SelectOption[];
  lotOptions?: SelectOption[];
  procedureFormState?: FBProcedureFormState;
  disabled?: boolean;
};

export interface FBProcedureFormActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}
