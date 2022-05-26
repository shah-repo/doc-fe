import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { debounce, filter, find, get, includes, isEmpty, isObject, isString, isUndefined, map } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FB, FBAutocompleteProps, FBOptionValueType } from "..";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { isTranslation } from "../../translations/types";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onInputChange,
    getOptionDisabled,
    getOptionLabel,
    filterOptions,
    debounceFilterInput,
    groupBy,
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    labelPrefixRoot,
    groupByKey,
    disabledOptions,
    placeholder,
    name = "",
    defaultValue,
    options,
    optionId,
    freeSolo,
    withState,
    omitFormValue,
    disabled,
    isDocumentLHRT,
    editorProperties,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = (!FB.isConsideredEmptyInput(workspaceState?.document?.formInput?.[name]) &&
      !isInputOwner) || disabled;
    const formValue = formState?.getFieldValue(name) || defaultValue;

    const multiple = editorProperties?.includes("multiple") || props.multiple;
    const includeQRScan = editorProperties?.includes("includeQRScan") || props.includeQRScan;

    const intl = useIntl();
    const [modifiedOptions, setModifiedOptions] = useState(options);
    // TO DO: Find another way with BE to chechk if doc is LHRT
    // isDocumentLHRT = workspaceState?.document?.document.documentType.documentTypeAcronym === "LHRT-";
    // {[defaultValue?.id]: defaultValue?.approvals}

    const isDocumentLHR = workspaceState?.document?.document.documentType.documentTypeAcronym === "LHR-";
    if (isDocumentLHR && !isEmpty(defaultValue?.approvals)) {
      const formObj = JSON.parse(JSON.stringify(defaultValue?.approvals));
      const exitObj = formState?.getApprovals as any;
      if (exitObj) {
        formState?.setApprovalMap({ [defaultValue?.id]: formObj });
      }
      console.log("ddddd", formState?.getApprovalMap);
    }

    useEffect(() => {
      setModifiedOptions(options);
    }, [options]);

    function getDefault() {
      function  sliceValue(value: any) {
        return multiple
          ? filter(options, (o) => (value || formValue).includes(o[optionValueKey]))
          : find(options, { [optionValueKey]: value || formValue });
      }

      const objectValue: Record<FBOptionValueType, () => any> = {
        object: () => formValue,
        key: () => sliceValue(formValue) || formValue,
        id: (value?: any) =>  {
          const slicedValue = multiple
            ? map(value || formValue, optionValueKey)
            : get(value || formValue, optionValueKey);
          return sliceValue(slicedValue);
        },
      };
      return objectValue[optionValueType]();
    }

    if (placeholder && isTranslation(placeholder)) {
      placeholder = intl.formatMessage({ id: placeholder });
    }

    (!optionId && options && formValue && !isEmpty(formValue)) && (defaultValue = getDefault());

    !getOptionLabel && (getOptionLabel = (option) => {
      if (freeSolo && isString(defaultValue) && isString(option)) {
        return option;
      }
      if (!isObject(option)) {
        option = defaultValue;
      }
      let optionText = get(option, optionLabelKey);
      if (isTranslation(optionText)) {
        optionText = intl.formatMessage({ id: optionText });
      }
      const optionLabel = labelPrefixRoot ? `${get(option, labelPrefixRoot)} - ` : "";
      return `${optionLabel}${optionText}`;
    });

    groupByKey && (groupBy = (option) => option[groupByKey]);

    disabledOptions && (getOptionDisabled = (option) =>
      includes(disabledOptions, option.id)
    );

    onInputChange = (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // setField doesn't work here, the same problem prefilled with first option
      if (!freeSolo) { return; }
      const { target: { value = "" } = {} } = ev;
      formState?.setFieldValue(name, value, withState, omitFormValue);
      formState?.validate();
    };

    if (!filterOptions) {
      // disable filtering on client
      filterOptions = (options) => options;
    }

    const onFilterInputChange = (event, inputValue) => {
      if (inputValue && inputValue.length > 2) {
        const stringify = (option: OptionType) => (getOptionLabel && getOptionLabel(option)) || "";
        const filterOptions = createFilterOptions({ ignoreAccents: false, stringify });
        const updatedOptions = filterOptions(options, { inputValue });
        setModifiedOptions(updatedOptions);
      } else if (!inputValue) {
        setModifiedOptions(options);
      }
    };

    debounceFilterInput = debounce(onFilterInputChange, 1000);

    if (isUndefined(defaultValue)) {
      defaultValue = "";
    }
    return Component({
      ...(props as T),
      onInputChange,
      getOptionDisabled,
      getOptionLabel,
      filterOptions,
      debounceFilterInput,
      groupBy,
      groupByKey,
      options,
      modifiedOptions,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      placeholder,
      multiple,
      optionId,
      freeSolo,
      value: defaultValue,
      withState,
      omitFormValue,
      name,
      disabled,
      includeQRScan,
      disabledOptions,
    });
  };

  return (props: T) => Comp(props);
};
