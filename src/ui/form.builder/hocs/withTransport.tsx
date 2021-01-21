import { find, get } from "lodash";
import React from "react";
import { toastError } from "../../components/notifications";
import FBStore from "../stores/ui/FBStore";
import { FBTemplateSchema } from "../types/store";
import { FBTransportSchemaProps } from "../types/transport";
import { withDialogState } from "./withDialogState";

export const withTransport = <T extends FBTransportSchemaProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const readFile = (file: Blob) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => setFileContent(reader.result);
    };

    const setFileContent = (result: string | ArrayBuffer | null) => {
      if (!result as unknown as string) {
        return toastError("Not a valid template.");
      }

      const schema: FBTemplateSchema[] = JSON.parse(result as string);
      if (!find(schema, "type") && !find(schema, "index")) {
        return toastError("Not a valid template.");
      }

      FBStore.setSchema(schema);
    };

    const importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = get(event, "currentTarget.files[0]");
      if (!file) {
        return toastError("Invalid file.");
      }
      return readFile(file);
    };

    const exportSchema = () => {
      const { setDialogClose } = props;
      const schema = JSON.stringify(FBStore.getSchema());
      const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(schema)}`;
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.download = `${FBStore.getName() || "template"}.json`;
      anchor.href = dataStr;
      anchor.click();
      setDialogClose && setDialogClose();
    };

    const setSchemaName = (filedName: string, value: any) => {
      FBStore.setName(value);
    };

    return Component({
      ...(props),
      importSchema,
      exportSchema,
      setSchemaName,
    });
  };

  return withDialogState((props: T) => Comp(props));
};
