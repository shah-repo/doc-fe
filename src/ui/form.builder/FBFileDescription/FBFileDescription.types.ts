import { FBFilePresenterModeProps, FBProviderProps } from "..";

export type FBFileDescriptionProps =
& FBFilePresenterModeProps
& Pick<FBProviderProps, "formState">;

export interface FBFileDescriptionActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}
