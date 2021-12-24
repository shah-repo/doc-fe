import { DocumentRevisionFooterState, DocumentRevisionFormState, SMFormState, SMTabsState } from "../../..";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SMProviderProps {
  _formState?: SMFormState;
  _documentRevisionFooterState?: DocumentRevisionFooterState;
  _documentRevisionFormState?: DocumentRevisionFormState;
  _tabsState?: SMTabsState;
}
