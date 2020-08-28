import Base64 from "Base64";
import { join, map, template as lodashTemplate } from "lodash";
import marked from "marked";
import React from "react";
import { FBFormMarkDownProps } from ".";
import { FB } from "..";

export const withFBFormMarkDown = <T extends FBFormMarkDownProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({ ...props }: T) => {
    const { workspaceState, formState } = FB.useStores();

    const template = lodashTemplate(`
      <%= label %>
      ========================
      - **type:**  <%= type %>
      - **name:**  <%= name %>
      - **rules:**  <%= rules %>
      - **value:**  <%= value %>
      - **custom validator:**
      <%= customValidator %>
    `);

    const source = (): string => {
      const tpl = map(workspaceState?.getSchema(), (schemaItem) => {
        let { customValidator } = schemaItem;
        const { name } = schemaItem;
        customValidator = customValidator
          ? Base64.atob(customValidator.fn || "")
          : "";
        return template({
          ...schemaItem,
          value: formState?.getFieldValue(name, ""),
          label: (schemaItem.label as string) || "",
          customValidator,
        });
      });

      return join(tpl, "\n");
    };

    const exportMarkdown = () => {
      const md = marked(source());
      const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(md)}`;
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.download = "schema.md";
      anchor.href = dataStr;
      anchor.click();
    };

    return Component({
      ...(props),
      exportMarkdown,
    });
  };

  return (props: T) => Comp(props);
};
