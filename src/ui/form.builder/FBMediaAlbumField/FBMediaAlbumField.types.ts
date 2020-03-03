import { FBMediaAlbumFieldUpload } from ".";
import { FBMediaAlbumFieldState, FBMediaProps } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaAlbumFieldMode = "mediaMode" | "qr";
export type FBMediaStatus = "AVAILABLE" | "USED" | "OBSOLETED";

export type FBMediaAlbumFieldProps = FBInputProps & {
  mode?: FBMediaAlbumFieldMode;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  mediaAlbumFieldUpload?: FBMediaAlbumFieldUpload;
  qrValue?: string;
  onClick?: () => any;
  onFileUploadChange: (event: React.FormEvent<HTMLInputElement>) => any;
  collection?: FBMediaProps[];
};

export interface FBMediaBodyProps {
  documentId: string;
  status: FBMediaStatus;
}

export interface FBMediaUploadBodyProps {
  filename: string;
}

export interface FBMediaPresignedUrlProps {
  url: string;
}

export interface FBMediaCandidateBody {
  name: string;
  type: string;
  preSignedUrl: string;
  fieldNameFromSchema: string;
  document: {
    id: string;
  };
}
