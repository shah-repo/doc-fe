import { FBAutocompleteAsyncProps, FBAutocompleteProps, FBFormProps, FBProcedureFormState, FBProcedureItemProps } from "..";
import { SelectOption } from "../../components/forms/fields/Select";

export enum FBProcedureFormFilterType {
  parts = "title",
  lots = "partLot",
}

type FBProcedureFormMode = "eb" | "mpi" | "lhr";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "type">
& Pick<FBAutocompleteAsyncProps, "optionId" | "disabledOptions">
& {
  handleChangeOfPart?: () => void;
  handleChangeOfLot?: () => void;
  handleReloading?: () => void;
  lotFilterOptions?: FBAutocompleteProps["filterOptions"];
  partFilterOptions?: FBAutocompleteProps["filterOptions"];
  partOptions?: SelectOption[];
  lotOptions?: SelectOption[];
  procedureFormState?: FBProcedureFormState;
  disabled?: boolean;
  partLoading?: boolean;
  lotLoading?: boolean;
  mode?: FBProcedureFormMode;
  lhrStepIndex?: number;
};

export interface FBProcedureFormActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}
