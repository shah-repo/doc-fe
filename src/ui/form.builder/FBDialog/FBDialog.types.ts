import { DialogProps, SvgIconProps } from "@material-ui/core";

export type FBDialogProps =
  & Pick<Partial<DialogProps>, "open" | "title" | "maxWidth">
  & {
    title?: React.ReactNode | string;
    content?: React.ReactNode;
    actions?: React.ReactNode;
    onCloseClick?: SvgIconProps["onClick"];
  };
