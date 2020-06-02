import _ from "lodash";
import React from "react";
import { FBData, FBEditorOptionsProps, FBEditorPropertiesType, FBOption } from "..";

export const withFBEditorOptions = <T extends FBEditorOptionsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    stringToOptions,
    optionsToString,
    ...props
  }: T) => {

    function stringOptions(options: string): FBOption[] {
      const stripOptions = options.replace(/^\s+|\s+$/g, "").split("\n");
      return stripOptions.map((text) => ({
        value: text,
        text,
      }));
    }

    function editorOptions(editorProperties: FBEditorPropertiesType[]): FBOption[] {
      const editorProps = _.pickBy(FBData.editorProperties, (e) => e.isOption);
      const intersectionOptions = _.intersection(_.keys(editorProps), editorProperties);
      return intersectionOptions.map((key) => ({
        value: key,
        text: editorProps[key].outputText || "",
      }));
    }

    stringToOptions = (options = "", editorProperties: FBEditorPropertiesType[] = []): FBOption[] => {
      const strOptions = stringOptions(options);
      const eOptions = editorOptions(editorProperties);
      const mergedOptions = _.union(strOptions, eOptions);
      const includeNoneIndex = _.findIndex(mergedOptions, { value: "includeNone" });
      if (includeNoneIndex > 0) {
        const includeNone = mergedOptions[includeNoneIndex];
        mergedOptions.splice(includeNoneIndex, 1);
        mergedOptions.splice(0, 0, includeNone);
      }
      return mergedOptions;
    };

    optionsToString = (options?: FBOption[]): string => {
      if (!options) { return ""; }
      const editorProps = _.keys(FBData.editorProperties);
      return options.reduce((acc, opt) => {
        !editorProps.includes(opt.value) && (acc += `${opt.text}\n`);
        return acc;
      }, "").replace(/^\s+|\s+$/g, "");
    };

    return Component({
      ...(props as T),
      stringToOptions,
      optionsToString,
    });
  };
  return (props: T) => Comp(props);
};
