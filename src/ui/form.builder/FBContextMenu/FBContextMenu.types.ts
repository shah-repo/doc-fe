import { BoxProps, MenuProps } from "@material-ui/core";
import { FBContextMenuState } from ".";
import { TextProps } from "../../components/Text";
import { FBFormProps } from "../FBForm";

export interface FBContextMenuItemProps {
  id: string;
  text: string;
  textValues?: TextProps["values"];
  hidden?: boolean;
  onClick: () => any;
}

export type FBContextMenuProps =
& Pick<BoxProps, "onContextMenu">
& Pick<Partial<MenuProps>, "anchorPosition" | "open">
& Pick<FBFormProps, "children">
& {
  onClose?: () => any;
  onBlur?: () => any;
  contextMenuState?: FBContextMenuState;
  menuItems?: FBContextMenuItemProps[];
  menuEls?: FBFormProps["children"];
  boxProps?: Omit<BoxProps, "onContextMenu" | "onBlur">;
};
