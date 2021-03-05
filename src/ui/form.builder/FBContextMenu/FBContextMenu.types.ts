import { BoxProps, MenuProps } from "@material-ui/core";
import { FBContextMenuState, FBFormProps } from "..";
import { TextProps } from "../../components/Text";

interface FBContextMenuItemProps {
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
  menuId?: string;
  contextMenuState?: FBContextMenuState;
  menuItems?: FBContextMenuItemProps[];
  menuEls?: FBFormProps["children"];
  boxProps?: Omit<BoxProps, "onContextMenu" | "onBlur">;
};
