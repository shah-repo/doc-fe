import { FBInputProps, FBProcedureItemConfig, FBProcedureItemProps } from "..";
import Colors from "../../layout/theme/utils/colors";

export type FBPartItemStatus = "removed" | "added" | "updated" | "none";

export const FBPartItemStatusBorder: Record<FBPartItemStatus, string> = {
  removed: Colors.opal_red,
  added: Colors.light_green,
  updated: Colors.gray,
  none: Colors.medium_blue,
};

export const FBPartItemStatusBg: Record<FBPartItemStatus, string> = {
  removed: Colors.medium_red,
  added: Colors.pale_green,
  updated: Colors.platinum_gray,
  none: Colors.light_blue,
};

export type FBPartsItemProps =
& Pick<FBInputProps, "gutter">
& Pick<FBProcedureItemProps, "name" | "type" | "getItem" | "getLot" | "loading">
& {
  getItemUrl?(id: string): string | undefined;
  collection?: FBProcedureItemConfig[];
};
