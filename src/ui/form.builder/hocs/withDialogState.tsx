import React from "react";
import { Translation } from "../../translations/types";
import { FBDialogProps } from "../types/dialog";

export const withDialogState = <T extends FBDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState<React.ReactNode | undefined>(undefined);
    const [title, setTitle] = React.useState<React.ReactNode | false>(
      props.title || false,
    );

    const setDialogOpen = () => setOpen(true);
    const setDialogClose = () => setOpen(false);
    const setDialogContent = (
      content: React.ReactNode,
      title: string | Translation | false | undefined = props.title,
    ) => {
      setContent(content);
      setTitle(title);
    };

    return Component({
      ...(props),
      setDialogOpen,
      setDialogClose,
      setDialogContent,
      open,
      content,
      title,
    });
  };

  return (props: T) => Comp(props);
};
