import { FBActionModel } from "../../stores/domain/models/FBActionModel";

export interface FBActionContainerProps {
    actions?: string[] | React.ReactNode[];
}

export interface FBActionProps {
    indicators?: React.ReactNode[];
    actionButton?: React.ReactNode;
    action: Partial<FBActionModel>;
}