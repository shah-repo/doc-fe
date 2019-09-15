
export interface FBContextProps {
  title: string;
  formNumber: number;
  status: string;
  elements: string[];
  modalState: string;
  currentField: number;
}

export interface FBContextInjectedProps {
  get: (key: keyof FBContextProps) => any;
  set: (key: keyof FBContextProps, value: any) => any;
  remove: (key: keyof FBContextProps) => any;
}

export type FBStoreProps = FBContextProps & FBContextInjectedProps;

export interface FBWithStoreProps {
  store: FBStoreProps;
}
