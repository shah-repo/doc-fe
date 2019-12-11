import { FBActionModel } from "../../stores/domain/models/FBActionModel";
import { FBFormikFieldProps } from "../formik";

export interface FBActionContainerProps {
    actions?: string[] | React.ReactNode[];
}

export type FBActionProps =
    & Omit<FBFormikFieldProps, "name">
    & {
    indicators?: React.ReactNode[];
    actionButton?: React.ReactNode;
    action: Partial<FBActionModel>;
}