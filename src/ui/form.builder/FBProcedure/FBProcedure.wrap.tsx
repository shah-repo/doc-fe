import { cloneDeep, differenceBy, filter, find, isEqual, keys, map, union, unionBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFieldName, FBInputState, FBMediaAlbumFieldStore, FBProcedureItemConfig, FBProcedureItemType, FBProcedureOmitDiffKey, FBProcedureProps, FBProcedureState, FBProcedureValue } from "..";
import { useFormContext } from "../../components/forms/FormContext";

export const withFBProcedure = <T extends FBProcedureProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    procedureState,
    isPreview,
    isOutput,
    index = 0,
    types,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { mode } = workspaceState || {};
    const { submitForm } = useFormContext();
    const formValue = formState?.getFieldValue(name) as FBProcedureValue;
    procedureState = FB.useRef(FBProcedureState, formValue);
    isOutput = Boolean(workspaceState?.isOutput && workspaceState?.id);
    isPreview = workspaceState?.mode === "preview";
    const diffValue = formState?.inputState.get(FBFieldName.ProcedureDiff)?.value;
    procedureState?.setDiffPreview(diffValue);
    const inputState = FB.useRef<FBInputState>(FBInputState, {});
    formState?.inputState.set(`${FBFieldName.ProcedureDiff}${name}`, inputState);
    types = keys(FBProcedureItemType);

    // MARK: @reactions
    // Form sync
    React.useEffect(() => reaction(
      () => procedureState?.value,
      (data) => formState?.setFieldValue(name, {
        ...formState.getFieldValue(name),
        ...cloneDeep(data),
      }, true), {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Autosave trigger
    React.useEffect(() => reaction(
      () => procedureState?.value,
      () => formState?.setFieldAutosave(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Diff switch
    React.useEffect(() => reaction(
      () => formState?.inputState.get(FBFieldName.ProcedureDiff)?.value,
      (checked) => {
        const diffInput = `${FBFieldName.ProcedureDiff}${name}`;
        if (!checked) {
          return formState?.setFieldValue(diffInput, undefined, true);
        }
        const diffCollection = getDiffValue();
        procedureState?.setDiffValue(diffCollection);
        formState?.setFieldValue(diffInput, diffCollection, true);
      }, {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function getDiffValue(): FBProcedureValue {
      const { document: { parent: { formInput = {} } = {} } = {} } = workspaceState || {};
      const parentValue = (formInput[name || ""] || {}) as FBProcedureValue;
      const childValue =  procedureState?.value || {};
      const valueKeys = union(keys(parentValue), keys(childValue));
      let diffValue = {};

      map(valueKeys, (key) => {
        if (FBProcedureOmitDiffKey.includes(key)) { return; }
        const parentKeyValue: FBProcedureItemConfig[] = parentValue[key];
        const childKeyValue: FBProcedureItemConfig[] = childValue[key];

        const unionParts = unionBy(childKeyValue, parentKeyValue, "id");
        const removedParts: string[] = map(differenceBy(parentKeyValue, childKeyValue || [], "id"), "id");
        const addedParts: string[] = map(differenceBy(childKeyValue, parentKeyValue || [], "id"), "id");

        diffValue = {
          ...diffValue,
          [key]: map(unionParts, (part) => {
            const { id } = part;
            switch (true) {
              case removedParts.includes(id):
                return { ...part, status: "removed" };
              case addedParts.includes(id):
                return { ...part, status: "added" };
              default: {
                const parentPart = find(parentKeyValue, { id });
                const childPart = find(childKeyValue, { id });
                if (!isEqual(parentPart, childPart)) {
                  return { ...part, status: "updated" };
                }
                return { ...part, status: "none" };
              }
            }
          }),
        };
      });
      return diffValue;
    }

    // MARK: @methods
    handleAdd = (isClone?: boolean) => {
      const newName = FB.uniqid;
      const newItem = {
        ...workspaceState?.getSchemaItemAt(index),
        name: newName,
      };
      if (isClone) {
        formState?.setFieldValue(newName, formState.getFieldValue(name));
      }
      workspaceState?.setSchemaItemAt(newItem, index + 1);
      submitForm();
    };

    // MARK: @observer
    useObserver(() => {
      const attach = FBMediaAlbumFieldStore.data.get(`${name}.attachments`);
      if ((mode === "preview" || mode === "formPreview") && attach?.size === 0) {
        types = filter(types, (type) => type !== "attachments");
      }
    });

    return Component({
      ...(props as T),
      handleAdd,
      procedureState,
      isPreview,
      isOutput,
      types,
      index,
      name,
    });
  };

  Comp.displayName = "withFBProcedure";
  return Comp;
};
