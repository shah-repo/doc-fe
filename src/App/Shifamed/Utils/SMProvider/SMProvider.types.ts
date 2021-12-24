import { DocumentRevisionFooterState, FormFooterState, SMFormState } from "../../..";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SMProviderProps {
  _formState?: SMFormState;
  _formFooterState?: FormFooterState;
  _documentRevisionFooterState?: DocumentRevisionFooterState;
}
