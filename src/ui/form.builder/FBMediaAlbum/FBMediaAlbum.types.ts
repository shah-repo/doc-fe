import { BoxProps } from "@material-ui/core";
import { FBMediaAlbumFieldProps, FBMediaAlbumState, FBProviderProps, FBWorkspaceMode } from "..";

export type FBMediaAlbumMode = "carousel" | "gallery";

export interface FBMediaProps {
  id: string;
  s3link: string;
  fieldNameFromSchema: string;
  type: string;
  name: string;
  order?: number;
}

export type FBMediaAlbumProps =
  & Pick<BoxProps, "height" | "width">
  & Pick<FBProviderProps, "formState">
  & Pick<FBMediaAlbumFieldProps,
  | "collection"
  | "removeMedia"
  | "setMediaFieldMode"
  | "loading"
  | "name"
  | "onFileUploadChange"
  | "actionsDisabled"
  | "autosave"
  >
  & {
    onClick?: () => void;
    setMediaMode?: () => any;
    mediaAlbumState?: FBMediaAlbumState;
    workspaceMode?: FBWorkspaceMode;
    mode?: FBMediaAlbumMode;
    title?: string;
    hiddenContainer?: boolean;
    uploadDisabled?: boolean;
  };
