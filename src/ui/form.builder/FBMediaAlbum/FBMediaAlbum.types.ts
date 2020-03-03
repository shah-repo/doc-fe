import { BoxProps } from "@material-ui/core";
import { FBMediaAlbumState } from ".";

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

export type FBMediaAlbumProps = Pick<BoxProps, "height" | "width"> & {
  collection?: FBMediaProps[];
  mediaAlbumState?: FBMediaAlbumState;
  mode?: FBMediaAlbumMode;
  title?: string;
  actionIcons?: FBMediaAlbumActionProps[];
  onClick?: () => any;
};

export interface FBMediaAssetBodyProps {
  s3link: string;
}

export interface FBMediaAssetDataProps {
  url: string;
}
