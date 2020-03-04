import { FBMediaAlbumFieldState, FBMediaProps, FBMediaQRMode } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaAlbumFieldMode = "mediaMode" | "qr" | "preview";
export type FBMediaStatus = "AVAILABLE" | "USED" | "OBSOLETED";

export type FBMediaAlbumFieldProps = FBInputProps & {
  onFileUploadChange: (event: React.FormEvent<HTMLInputElement>) => any;
  removeMedia?: (mediaId: string) => any;
  onClick?: () => any;
  mode?: FBMediaAlbumFieldMode;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  qrValue?: string;
  qrMode?: FBMediaQRMode;
  collection?: FBMediaProps[];
  loading?: boolean;
};

export interface FBMediaUrlProps {
  url: string;
}
