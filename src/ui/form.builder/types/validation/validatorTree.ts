import { FBStoreProps } from "../store";

export type FBValidatorTreeProps =
  & Pick<FBStoreProps, "dynamicValidatorStore">
  & {
    expanded?: string[];
    onNodeToggle?: (event: React.ChangeEvent<{}>, nodes: string[]) => void;
    items?: React.ReactNode[];
  };
