import { FBAttachment } from "..";

export type FBFilePreviewType = "video" | "image" | "pdf";

export interface FBFilePreviewProps {
  file: FBAttachment;
  previewType?: FBFilePreviewType;
}
