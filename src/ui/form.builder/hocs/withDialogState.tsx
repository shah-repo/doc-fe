import React from "react";
import { Translation } from "../../translations/types";
import { Subtract } from "../types/common";
import { FBDialogInjectedProps, FBDialogStateProps } from "../types/dialog";

export function withDialogState<T extends FBDialogInjectedProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBDialogInjectedProps>> {
    public state: FBDialogStateProps = {
      open: false,
      content: undefined,
      title: (this.props as T).title || false,
    };

    public setOpen = () => this.setState({ open: true });
    public setClose = () => this.setState({ open: false });
    public setContent = (
      content: React.ReactNode,
      title: string | Translation | false | undefined = (this.props as T).title,
    ) => this.setState({ ...this.state, content, title })

    public render() {
      return (
        <Component
          title={this.state.title}
          {...this.props as T}
          setDialogOpen={this.setOpen}
          setDialogClose={this.setClose}
          setDialogContent={this.setContent}
          open={this.state.open}
          content={this.state.content}
        />
      );
    }
  };
}
