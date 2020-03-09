import { Dictionary } from "lodash";
import { FBFormikFieldProps } from "./formik";
import { FBTemplateSchema } from "./store";

export type FBWorkspaceMode =
| "none"
| "design"
| "form"
| "preview";

export type FBWorkspaceProps =
  & Omit<FBFormikFieldProps, "name">
  & {
    id?: string;
    documentId?: string;
    mode?: FBWorkspaceMode;
    includeTransport?: boolean;
    isStarter?: boolean;
    schema?: FBTemplateSchema[];
    values?: Dictionary<any>;
  };
