import { Attachment as AttachmentInterface } from "../../../state/ducks/attachments";
import { Id } from "../../../state/ducks/common";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FBSchemaProps } from "../../form.builder";

export type Attachment = AttachmentInterface;

export interface FileUploadFormValues {
  file?: File;
}

export interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface ImplementationPlanTaskFormValues {
  id?: string;
  title: string;
  description: string;
  dueDate?: Date;
  assigned?: OptionType;
  status: string;
}

export interface ImplementationPlanFormValues {
  attachments: Attachment[];
  tasks: ImplementationPlanTaskFormValues[];
}

export interface ChangeRequestFormValues {
  id?: string;
  title: string;
  description: string;
  formInput?: Record<string, any>;
  formDocument?: FBDocumentRevisionProps;
  documentType?: Id;
}

export interface PasswordFormValues {
  password: string;
}

export interface EffectiveDateFormValues {
  effectiveDate: string;
}

export interface SelectTemplateFormValues {
  chosenFormId: string;
}

export interface TemplateOption {
  label: string;
  value: string;
  docTypeId: string;
  schema?: FBSchemaProps[];
  formInput?: Record<string, any>;
}

export interface ApproverPayload {
  approver: {
    id: string | null;
  };
  signatureGroupId: {
    id: string | null;
  };
}
