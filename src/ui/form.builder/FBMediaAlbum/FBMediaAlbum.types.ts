import { BoxProps } from "@material-ui/core";
import { FBMediaAlbumState } from ".";
import { FBMediaAlbumFieldProps } from "..";

export type FBMediaAlbumMode = "carousel" | "gallery";

export interface FBMediaProps {
  id: string;
  s3link: string;
  fieldNameFromSchema: string;
  type: string;
  name: string;
}

export interface FBMediaAlbumActionProps {
  icon: React.ReactNode;
  onClick?: () => any;
}

export type FBMediaAlbumProps =
  & Pick<BoxProps, "height" | "width">
  & Pick<FBMediaAlbumFieldProps, "collection" | "removeMedia">
  & {
    mediaAlbumState?: FBMediaAlbumState;
    mode?: FBMediaAlbumMode;
    title?: string;
    actionIcons?: FBMediaAlbumActionProps[];
    onClick?: () => any;
    remove?: () => any;
    name?: string;
    fieldMode?: FBMediaAlbumFieldProps["mode"];
  };
