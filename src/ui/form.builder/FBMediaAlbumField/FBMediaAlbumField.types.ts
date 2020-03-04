import { FBMediaAlbumFieldState, FBMediaProps } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaAlbumFieldMode = "mediaMode" | "qr";
export type FBMediaStatus = "AVAILABLE" | "USED" | "OBSOLETED";

export type FBMediaAlbumFieldProps = FBInputProps & {
  onFileUploadChange: (event: React.FormEvent<HTMLInputElement>) => any;
  onClick?: () => any;
  mode?: FBMediaAlbumFieldMode;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  qrValue?: string;
  collection?: FBMediaProps[];
  loading?: boolean;
};

export interface FBMediaUrlProps {
  url: string;
}
