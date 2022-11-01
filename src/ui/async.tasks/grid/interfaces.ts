import { EffectiveDateFormValues, PasswordFormValues } from "../../change.request/form/types";
import { KendoColumn } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";
import { Async } from "../../hooks/useAsync";
import { DialogHandler } from "../../hooks/useDialog";
import { TimeTravelProps } from "../types";

export interface KendoPresenterProps {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  columns: KendoColumn[];
  onRowClick: ((dataItem: any) => void);
  queryUrl: string;
  type: string;
  async: Async;
  transitionDialog: DialogHandler;
  handleChange: (event: React.ChangeEvent<{value: any}>) => void;
  handleEmptyFormSubmit: () => void;
  handleDateFormSubmit: (selectedDate: string) => void;
  handlePasswordExpirationFormSubmit: (data: any) => void;
  handlePasswordExpirationEmailSpecificFormSubmit: (data: any) => void;
  handleuuidFormSubmit: (uuid: string) => void;
  handleEmailFormSubmit: (email: string) => void;
  handleTimeTravelFormSubmit: (values: TimeTravelProps) => void;
  handleTimeTravelCompany: (values: TimeTravelProps) => void;
  handleTimeTravelUser: (values: TimeTravelProps) => void;
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
}
