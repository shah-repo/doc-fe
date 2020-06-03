import { unflatten } from "flat";
import { compact, first, groupBy, last, map, range, size, union } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBApprovalAuditProps, FBApprovalAuditState, FBAuditData, FBFieldName } from "..";
import { TIME_ZONE } from "../../../common/utils/date";
import { isTranslation } from "../../translations/types";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBInputType } from "../FBInput";
import FBStore from "../FBStore/FBStore";

export const withFBApprovalAudit = <T extends FBApprovalAuditProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    approvalAuditState,
    audits,
    loading,
    index,
    name,
    type,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const { id: documentId, isOutput } = workspaceState || {};
    const intl = useIntl();
    approvalAuditState = FB.useRef(FBApprovalAuditState, { documentId, isOutput });

    function underApproval(): string[] | undefined {
      if (!name) { return; }
      const { schema } = workspaceState || {};
      const underApprovalField: string[] = [name];

      range(0, index).reverse().some((current) => {
        if (!schema) { return; }
        const item =  schema[current];
        const { type, name = "" } = item;
        if (type === "requestapproval" || type === "approval") { return true; }
        underApprovalField.push(name);
        return false;
      });
      return underApprovalField;
    }

    const omitHistory: FBInputType[] = [
      "instructionsdocument",
      "autocomplete",
      "selectdocument",
      "autocompleteasync",
      "poreceive",
      "evidencemediaupload",
      "instructionsdocument",
      "testRequirement",
      "selectrequirement",
      "hellosign",
      "approvalMatrix",
      "poApprovalMatrix",
    ];
    function formInputAudit(audits?: FBAuditData[]): FBAuditData[] | undefined {
      if (!audits || !isApproved()) { return; }
      const underApprovalFields = underApproval();
      const grouped = groupBy(audits, (audit) => {
        const fieldName = audit.field.split(".")[1]?.split("[")[0];
        const { type, label } = workspaceState?.getSchemaItem(fieldName) || {};
        if (!type) { return "none"; }
        if (!underApprovalFields?.includes(fieldName) || omitHistory.includes(type)) {
          return "none";
        }
        return audit.groupId + "." + fieldName + "." + type + "." + label;
      });

      const filtered: Record<string, FBAuditData[]> = Object.keys(grouped)
        .filter((key) => key !== "none")
        .reduce((obj, key) => {
          obj[key] = grouped[key] || [];
          return obj;
        }, {});

      const poItemKeys = ["type", "order", "units", "description", "unitPrice", "tax", "capitalEquipment", "isTraceabilityRequired", "received", "formattedDate", "index"];
      const mapped = map(filtered, (v, k) => {
        const fieldName = k.split(".")[1] || "";
        const type = k.split(".")[2];
        const label = k.split(".")[3] || "";

        function isSimple() {
          let prevValue = v[0].previousValue;
          let nextValue = v[0].nextValue;

          if (nextValue === "[]") { return; } // checkgroup
          if (prevValue !== "undefined" && prevValue !== "") {
            if (moment(prevValue, moment.ISO_8601, true).isValid()) {
              prevValue = moment(prevValue).tz(TIME_ZONE, true).format("D MMM YYYY hh:mm:ss a");
            }
            prevValue = " from " + prevValue;
          } else {
            prevValue = "";
          }

          if (moment(nextValue, moment.ISO_8601, true).isValid()) {
            nextValue = moment(nextValue).tz(TIME_ZONE, true).format("D MMM YYYY hh:mm:ss a");
          }
          return "Changed " + label + prevValue + " to " + nextValue;
        }

        function isCheck() {
          return "Changed " + label + " value to " + v[0].nextValue;
        }

        const description: Partial<Record<FBInputType | "default", () => any>> = {
          purchaseorder: () => {
            const values = unflatten(
              groupBy(v, (t) => first(t.field.replace("formInput.", "").replace(fieldName + ".", "").split("[")))
            );
            if (size(values.items) < 2) { return; }
            const clearValues = map(values, (clearValue, clearKey) => {
              if (clearKey === "items") { return; }
              let prevValue = "";
              if (clearValue[0].previousValue !== "undefined") {
                prevValue += "from " + clearValue[0].previousValue + " to ";
              }
              let key = clearKey;
              if (isTranslation("form.builder." + clearKey)) {
                key = intl.formatMessage({ id: "form.builder." + clearKey });
              }
              return key + prevValue + clearValue[0].nextValue;
            });
            clearValues.push("Item: ");
            const itemValues = map(values.items, (itemValue) => {
              const itemKey: string = last(itemValue.field.split(".")) || "";
              if (!poItemKeys.includes(itemKey)) { return; }
              let key = itemKey;
              if (isTranslation("form.builder." + itemKey)) {
                key = intl.formatMessage({ id: "form.builder." + itemKey });
              }
              let prevValue = "";
              if (itemValue.previousValue !== "undefined") {
                prevValue += "from " + itemValue.previousValue + " to ";
              }
              return key + ": " + prevValue  + itemValue.nextValue;
            });
            return "Changed " + label + ": " + compact(union(clearValues, itemValues)).join(", ");
          },
          approval: () => "Approved",
          default: () => undefined,
          checkboxgroup: () => {
            if (v[0].previousValue === "undefined" && v[0].nextValue === "[]") { return; }
            if (v[0].nextValue === "undefined" || v[0].nextValue === "false") {
              return "Unchecked in " + label + ": " + v[0].previousValue;
            }
            return "Checked in " + label + ": " + v[0].nextValue;
          },
          textfield: () => isSimple(),
          texteditor: () => isSimple(),
          datepicker: () => isSimple(),
          select: () => isSimple(),
          radiogroup: () => isSimple(),
          checkbox: () => isCheck(),
          radio: () => isCheck(),
          fileupload: () => {
            const fields = ["name", "type"];

            const r = v.reduce((merged, clearValue, index) => {
              const clearKey: string = last(clearValue.field.split(".")) || "";
              if (!fields.includes(clearKey) || clearValue.field.includes("company")) {

                return merged;
              }
              merged += clearValue.nextValue + ((index % 2) === 0 ? "." : ", ");
              return merged;
            }, "Uploaded ");

            return r;
          },
        };

        const desc = (description[type || ""] || description.default)();
        if (!desc) { return; }
        return {
          ownerName: v[0].owner.user.name,
          formattedTime: moment(v[0].timestamp).tz(TIME_ZONE, true).format("D MMM YYYY hh:mm:ss a"),
          description: (description[type || ""] || description.default)(),
        };
      });
      return compact(mapped) as FBAuditData[];
    }

    function isApproved(): boolean {
      let hasValue = type === "approval"
        ? formState?.getFieldValue(name)
        : formState?.getFieldValue(FBFieldName.RequestApproval + name);
      hasValue = Boolean(hasValue);
      return hasValue;
    }

    useObserver(() => {
      audits = FBStore.audit.data;
      audits = formInputAudit(audits);
      loading = approvalAuditState?.loading;
    });

    React.useEffect(() => {
      reaction(
        () => FBAutocompleteAsyncStore.data,
        () => approvalAuditState?.refresh()
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      approvalAuditState,
      audits,
      loading,
      index,
      name,
      type,
    });
  };

  return (props: T) => Comp(props);
};
