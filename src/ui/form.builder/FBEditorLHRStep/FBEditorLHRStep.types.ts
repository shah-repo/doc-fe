import { FBEditorProps } from "..";

export interface FBEditorLHRStepConfigFilter {
  documentType: string[];
  revisionStatus: string[];
}

export type FBEditorLHRStepProps =
& FBEditorProps
& {
  documentTypeOptions: Record<any, any>[];
  editorConfig?: {
    filters?: FBEditorLHRStepConfigFilter;
  };
};
