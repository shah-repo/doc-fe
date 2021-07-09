import { assign, first, keys, map, reduce, get } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import { SM, SMStore, SMUrl } from "../../../App";
import { FBLockBody, FBLockProps } from "./FBLock.types";

export const withFBLock = <T extends FBLockProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { id } = workspaceState || {};
    const lockedFieldsUrl: string = SMStore.templateUrl(SMUrl.lockedFields, { id });

    useEffect(() => {
      if (!id) { return; }
      SMStore.get<FBLockBody, null>({
        url: lockedFieldsUrl,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    SM.reaction(
      () => SMStore.data.get(lockedFieldsUrl),
      (data: FBLockBody[]) => setLockedData(data),
    );

    // MARK: @helpers
    function setLockedData(data: FBLockBody[]) {
      if (!formState) { return; }
      formState.expireLocks = {};
      formState.locked.forEach((lockedField) => {
        formState.locked.set(lockedField.fieldName || "", {
          ...lockedField,
          locked: false,
        });
      });
      const dataArray = Array.from(data.values());
      const fields = map(dataArray, "fields");
      const records = reduce(fields, (record: Record<string, any>, field) => {
        map(first(map(field, "formInput")), (t, index) => {
          const fieldName = first(keys(t));
          if (!fieldName) { return; }
          const expiresAt = dataArray[index]?.expiresAt;
          if (!expiresAt) { return; }
          formState.expireLocks = {
            ...formState.expireLocks,
            [fieldName]: expiresAt,
          };
          setExpired(fieldName, expiresAt);
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

    function setExpired(fieldName?: string, expiresAt?: string) {
      if (!fieldName) { return; }
      if (!expiresAt) { return; }
      const expireTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      const milliSeconds = expireTime - currentTime;
      setTimeout(() => {
        const lockedField = formState?.locked.get(fieldName);
        const lastExpired = get(formState?.expireLocks, fieldName);
        if (!lastExpired) { return; }
        if (!lockedField || (new Date().getTime() < new Date(lastExpired).getTime())) { return; }
        formState?.locked.set(fieldName, {
          ...formState.locked.get(fieldName),
          locked: false,
        });
      }, milliSeconds);
    }

    // MARK: @methods

    // MARK: @observer

    return (
      <Component
        {...props}
      />
    );
  };

  Comp.displayName = "withFBLock";
  return Comp;
};
