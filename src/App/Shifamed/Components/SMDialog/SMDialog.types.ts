import { DialogProps } from '@material-ui/core';

export enum SMDialogAction {
  done = 'done',
  close = 'close',
  save = 'save',
  cancel = 'cancel',
  lhrBuildSwitch = 'lhr.build.switch'
}

export type SMDialogProps =
& Pick<Partial<DialogProps>, 'maxWidth'>
& SMDialogContextProps
& {
  onDialogActionClick?: (action: SMDialogAction) => void;
  toggle?: () => void;
  title?: string;
  actions?: SMDialogAction[];
  children?: React.ReactNode | React.ReactNode[];
  doneLabel?: string;
};

export interface SMDialogStateProps {
  setOpen?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

export interface SMDialogContextProps {
  dialogState?: SMDialogStateProps;
}

export type SMDialogHOCProps = SMDialogContextProps;
