import _, { assign, map, reduce } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import { SM, SMStore, SMUrl } from "../../../App";
import FBLockState from "./FBLock.state";
import { FBLockBody, FBLockProps } from "./FBLock.types";

export const withFBLock = <T extends FBLockProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    lockState,
    ...props
  }: T) => {

    // MARK: @config
    lockState = SM.useRef(FBLockState);
    const { workspaceState, formState } = FB.useStores();
    const { id } = workspaceState || {};
    const lockedFieldsUrl: string = SMStore.templateUrl(SMUrl.lockedFields, { id });

    useEffect(() => {
      if (!id) { return; }
      SMStore.get<FBLockBody, null>({
        url: lockedFieldsUrl,
      });
    }, []);

    // MARK: @reactions
    SM.reaction(
      () => SMStore.data.get(lockedFieldsUrl),
      (data: FBLockBody[]) => setLockedData(data),
    );

    // MARK: @helpers
    function setLockedData(data: FBLockBody[]) {
      formState?.locked.forEach((lockedField) => {
        formState?.locked.set(lockedField.fieldName || "", {
          ...lockedField,
          locked: false,
        });
      });
      const dataArray = Array.from(data.values());
      const fields = map(dataArray, "fields");
      const records = reduce(fields, (record: Record<string, any>, field) => {
        map(_.first(map(field, "formInput")), (t) => {
          assign(record, t);
        });
        return record;
      }, {});

      map(records, (locked, fieldName) => {
        formState?.locked.set(fieldName, {
          ...formState.locked.get(fieldName),
          fieldName,
          locked,
        });
      });
    }

    // MARK: @methods

    // MARK: @observer

    return (
      <Component
        {...props as T}
        {...{ lockState }}
      />
    );
  };

  Comp.displayName = "withFBLock";
  return Comp;
};
