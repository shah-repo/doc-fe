import { FBFilePresenterModeProps } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBFileDescriptionProps =
& FBFilePresenterModeProps
& Pick<FBProviderProps, "formState">;

export interface FBFileDescriptionActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}
