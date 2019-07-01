import { Attachment as AttachmentInterface } from "../../../state/ducks/attachments";
import { ImplementationPlan } from "../../../state/ducks/changeRequest";
import { Assessment } from "../../../state/ducks/changeRequest/types";
import { User } from "../../../state/ducks/common";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export type Attachment = AttachmentInterface;

export interface FileUploadFormValues {
  file?: File;
}

export interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface ImplementationPlanTaskFormUser {
  id: string;
  email?: string;
  name?: string;
}

export interface ImplementationPlanTaskForm {
  id?: string;
  title: string;
  description: string;
  dueDate?: Date;
  assigned?: ImplementationPlanTaskFormUser;
}

export interface ImplementationPlanTask {
  title: string;
  description: string;
  dueDate: Date;
  assigned: User;
}

export interface ChangeRequestFormValues {
  id?: string;
  description: string;
  justifications: Justifications;
  assessments: Assessment;
  implementationPlan: ImplementationPlan;
  effectiveDate?: Date;
  approvals: OptionType[];
  documentRevisions: string[];
}

export interface PasswordFormValues {
  password: string;
}
