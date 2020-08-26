import { MenuProps } from "@material-ui/core";
import { FBContextMenuState } from ".";
import { TextProps } from "../../components/Text";
import { FBFormProps } from "../FBForm";

export interface FBContextMenuItemProps {
  text: string;
  textValues?: TextProps["values"];
  hidden?: boolean;
  onClick: () => any;
}

export type FBContextMenuProps =
& Pick<React.DOMAttributes<HTMLDivElement>, "onContextMenu">
& Pick<Partial<MenuProps>, "anchorPosition" | "open">
& Pick<FBFormProps, "children">
& {
  onClose?: () => any;
  onBlur?: () => any;
  contextMenuState?: FBContextMenuState;
  menuItems?: FBContextMenuItemProps[];
  menuEls?: FBFormProps["children"];
};
