import { FBInputProps } from './common';
import { FBDocumentFlowProps } from './formik';

export type FBTemplateSchema = FBInputProps;

export type FBDRGroupConfig =
  & Pick<FBDocumentFlowProps, 'formInput'>
  & {
    docRevMode: FBDocumentRevisionMode
    schema: FBTemplateSchema[]
  };

export type FBDocumentRevisionMode =
  | 'none'
  | 'create'
  | 'update'
  | 'preview'
  | 'outputCreate'
  | 'outputUpdate'
  | 'outputPreview';
