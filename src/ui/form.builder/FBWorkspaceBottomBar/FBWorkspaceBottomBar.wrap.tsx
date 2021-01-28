import { Box } from "@material-ui/core";
import { find, get, unionBy, uniqWith } from "lodash";
import React from "react";
import { FB, FBFieldName, FBForm, FBSchemaProps, FBTextField, FBWorkspaceBottomBarProps, FBWorkspaceTplActions } from "..";
import { toastError } from "../../components/notifications";

export const withFBWorkspaceBottomBar = <T extends FBWorkspaceBottomBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleFormPreview,
    importSchema,
    exportSchema,
    previewDisabled,
    includeTransport,
    ...props
  }: T) => {

    const { workspaceState, dialogState } = FB.useStores();
    previewDisabled = !(workspaceState?.mode === "formPreview" || workspaceState?.mode === "design");
    includeTransport = includeTransport &&
      (workspaceState?.mode === "formPreview" || workspaceState?.mode === "design");

    const readFile = (file: Blob) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => setFileContent(reader.result);
    };

    const setFileContent = (result: string | ArrayBuffer | null) => {
      if (!result as unknown as string) {
        return toastError("Not a valid template.");
      }

      const schema: FBSchemaProps[] = JSON.parse(result as string);
      if (!find(schema, "type") && !find(schema, "index")) {
        return toastError("Not a valid template.");
      }

      const mergedSchema = uniqWith(
        unionBy(workspaceState?.schema, schema, "name"),
        (x, y) => x.type === y.type && x.uniqueSchemaItem === true,
      );

      workspaceState?.setSchema(mergedSchema);
    };

    importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = get(event, "currentTarget.files[0]");
      if (!file) {
        return toastError("Invalid file.");
      }
      return readFile(file);
    };

    exportSchema = () => {
      dialogState?.config({
        open: true,
        content: (
          <FBForm>
            <FBTextField
              label="form.builder.template.name"
              name={FBFieldName.TemplateName}
              rules="required"
            />
          </FBForm>
        ),
        actions: <FBWorkspaceTplActions />,
      });
    };

    handleFormPreview = () => {
      dialogState?.config({
        open: true,
        maxWidth: "md",
        title: "form.builder.form.preview",
        content: (
          <Box mx={8}>
            <FBForm schema={workspaceState?.schema} initialValidation={true} />
          </Box>
        ),
      });
    };

    return Component({
      ...(props as T),
      handleFormPreview,
      importSchema,
      exportSchema,
      includeTransport,
      previewDisabled,
    });
  };

  return (props: T) => Comp(props);
};
