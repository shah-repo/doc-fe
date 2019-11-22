import _ from "lodash";
import React from "react";
import FBStore from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBTemplateSchema } from "../types/store";
import { FBTransportSchemaInjectedProps, FBTransportSchemaProps } from "../types/transport";
import { withDialogState } from "./withDialogState";

export function withTransport<T extends FBTransportSchemaProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<
    Subtract<T, FBTransportSchemaInjectedProps>
  > {
    public render() {
      return (
        <Component
          {...(this.props as T)}
          importSchema={this.importSchema}
          exportSchema={this.exportSchema}
          setSchemaName={(this.setSchemaName)}
        />
      );
    }

    private readFile = (file: Blob) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => this.setFileContent(reader.result);
    }

    private setFileContent = (result: string | ArrayBuffer | null) => {
      if (!result as unknown as string) {
        return alert("Not a valid template.");
      }

      const schema: FBTemplateSchema[] = JSON.parse(result as string);
      if (!_.find(schema, "type") && !_.find(schema, "index")) {
        return alert("Not a valid template.");
      }

      FBStore.setSchema(schema);
    }

    private importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = _.get(event, "currentTarget.files[0]");
      if (!file) {
        return alert("Invalid file.");
      }
      return this.readFile(file);
    }

    private exportSchema = () => {
      const schema = JSON.stringify(FBStore.getSchema());
      const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(schema)}`;
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.download = `${FBStore.getName() || "template"}.json`;
      anchor.href = dataStr;
      anchor.click();
      this.props.setDialogClose();
    }

    private setSchemaName = (trigger: any) => {
      const value = (trigger as React.ChangeEvent<HTMLInputElement>).target.value;
      FBStore.setName(value);
    }
  }

  return withDialogState(HOC);
}
