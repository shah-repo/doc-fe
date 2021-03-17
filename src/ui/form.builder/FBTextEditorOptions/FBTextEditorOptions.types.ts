import { FBInputProps, FBProviderProps } from "..";

export type FBTextEditorOptionsProps =
& Pick<FBInputProps, "options">
& Pick<FBProviderProps, "textEditorOptionsState">
& {
  handleButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOptionsChange?: (value: string) => void;
  menuAnchorElement?: HTMLElement;
  menuVisible?: boolean;
};
