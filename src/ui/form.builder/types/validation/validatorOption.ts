import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FormikHybridFieldProps } from "../../../components/hoc/utils/types";
import { FBValidatorModel } from "../../stores/domain/models/FBValidatorModel";
import { FBOnChangeProps } from "../common";

export type FBValidatorOptionProps =
  & FormikHybridFieldProps
  & Partial<FBValidatorModel>
  & Pick<FBOnChangeProps, "onChange">
  & Pick<FormControlLabelProps, "checked">
  & {
    indicatorElements?: React.ReactNode[];
  };
