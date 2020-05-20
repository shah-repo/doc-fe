import { LinkProps } from "@material-ui/core";
import { FBInputProps } from "..";

export type FBHyperlinkProps =
& FBInputProps
& Pick<LinkProps, "onClick">;
