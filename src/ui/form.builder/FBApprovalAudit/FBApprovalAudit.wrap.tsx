import { compact, filter, get, groupBy, isEmpty, last, map, range, sortBy, toNumber } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import moment from "moment";
import React from "react";
import { FBAuditPOCalculation, FBAuditPOItem } from ".";
import { FB, FBApprovalAuditProps, FBApprovalAuditState, FBAuditData, FBFieldName } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBInputType } from "../FBInput";
import FBStore from "../FBStore/FBStore";

// *NOTE: This needs to be refactored! Wait for the BE changes
export const withFBApprovalAudit = <T extends FBApprovalAuditProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    approvalAuditState,
    approvalNonVersioned,
    audits,
    loading,
    index,
    name,
    type,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const {
      id: documentId,
      isOutput,
      document: { releasedAt = null, createdAt = (new Date()).toISOString() } = {},
    } = workspaceState || {};
    approvalAuditState = FB.useRef(FBApprovalAuditState, {
      documentId,
      isOutput,
    });

    function underApproval(): string[] | undefined {
      if (!name) { return; }
      const { schema } = workspaceState || {};
      const underApprovalField: string[] = [name];
      range(0, index).reverse().some((current) => {
        if (!schema) { return false; }
        const { type, name = "" } =  schema[current];
        if (type === "requestapproval" || type === "inlineapproval") { return true; }
        underApprovalField.push(name);
        return false;
      });
      return underApprovalField;
    }

    function formInputAudit(audits?: FBAuditData[]): FBAuditData[] | undefined {
      if (!audits || !isApproved()) { return; }
      const underApprovalFields = underApproval();
      const grouped = groupBy(audits, (audit) => {
        const fieldName = audit.field.split(".")[1]?.split("[")[0];
        const { type, label } = workspaceState?.getSchemaItem(fieldName) || {};
        if (!type) { return "none"; }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const isOmitted = FBApprovalAuditState.omitAudit.includes(type);
        if (!underApprovalFields?.includes(fieldName) || isOmitted) {
          return "none";
        }
        if (type === "checkboxgroup" || type === "autocomplete") {
          return audit.groupId + "." + fieldName + "." + type + "." + label + "." + audit.nextValue;
        }
        return audit.groupId + "." + fieldName + "." + type + "." + label;
      });

      const mapped = map(grouped, (v, k) => {
        if (k === "none") { return; }
        const fieldName = k.split(".")[1] || "";
        const type = k.split(".")[2];
        const label = k.split(".")[3] || "";

        function isSimple() {
          let prevValue = v[0].previousValue;
          let nextValue = v[0].nextValue;

          if (nextValue === "[]") { return; } // checkgroup
          if (prevValue !== "undefined" && prevValue !== "") {
            if (moment(prevValue, moment.ISO_8601, true).isValid()) {
              prevValue = getFormattedDateString(prevValue, MomentFormats.MonthDateYearAlt);
            }
            prevValue = <span> from <b>{FB.stripTags(prevValue)}</b></span>;
          } else {
            prevValue = "";
          }

          if (moment(nextValue, moment.ISO_8601, true).isValid()) {
            nextValue = getFormattedDateString(nextValue, MomentFormats.MonthDateYearAlt);
          }

          return (<span>Changed {label} {prevValue} to <b>{FB.stripTags(nextValue)}</b></span>);
        }

        function isCheck() {
          return (<span> Changed {label} value to  <b>{v[0].nextValue}</b> </span>);
        }

        function isPurchaseorder(): string {
          let desc = "Changed " + label + ": ";
          let calculation = "";
          let item = "";
          let itemIndex = 1;
          map(v, (p: FBAuditData) => {
            const { field, previousValue, nextValue } = p;
            const poKey = last(field.split("."));
            const poCalcName = FBAuditPOCalculation[poKey as keyof typeof FBAuditPOCalculation];
            const poItemName = FBAuditPOItem[poKey as keyof typeof FBAuditPOItem];
            const hasNoChange = (
              (previousValue === "undefined" || toNumber(previousValue) === 0) &&
              toNumber(nextValue) === 0
            );

            if (!field.includes("items") && poCalcName) { // Calculation
              if (hasNoChange) { return; }
              calculation += poCalcName;
              if (previousValue !== "undefined") {
                calculation += " from " + previousValue;
              }
              calculation += " to " + nextValue + ", ";
            } else if (poItemName) {
              if (poKey === "index") {
                itemIndex += toNumber(nextValue);
              }
              if (hasNoChange) { return; }
              item += poItemName;
              if (previousValue !== "undefined") {
                item += " from " + previousValue;
              }
              item += " to " + nextValue + ", ";
            }
          });
          !isEmpty(item) && (desc += "Item " + itemIndex + ": " + item.slice(0, -2));
          !isEmpty(item) && !isEmpty(calculation) && (desc += " | ");
          !isEmpty(calculation) && (desc += "Calculation: " + calculation.slice(0, -2));
          return desc;
        }

        function isCheckGroup() {
          const { previousValue, nextValue } = v[0];
          if (previousValue === "undefined" && nextValue === "[]") { return; }
          if (nextValue === "undefined" || nextValue === "false") {
            return (<span>Unchecked in {label}: {previousValue}</span>);
          }
          return (<span>Checked in {label}: <b>{nextValue}</b></span>);
        }

        function isFileupload() {


          const fields = ["name", "type"];
          const r = v.reduce((merged, clearValue, index) => {
            const { type: auditType = "" } = clearValue;
            if (index === 0) {
              merged += auditType.includes("NEW")
                ? "Uploaded: "
                : "Removed: ";
            }
            const clearKey: string = last(clearValue.field.split(".")) || "";
            if (!fields.includes(clearKey) || clearValue.field.includes("company")) {
              return merged;
            }
            const activeFieldValue = auditType.includes("NEW")
              ? clearValue.nextValue
              : clearValue.previousValue;
            merged += activeFieldValue + ((index % 2) === 0 ? "." : ", ");
            return merged;
          }, "");
          return r;
        }

        function isAutocomplete() {
          const { optionId } = workspaceState?.getSchemaItem(fieldName) || {};
          if (!optionId) { return; }
          approvalAuditState?.setAutocompleteOptionId(optionId);
          const data = FBAutocompleteAsyncStore.data.get(optionId || "");
          if (!data) { return; }
          const { labelKey = "text", labelPrefixRoot = "" } =
              approvalAuditState?.autocompleteApi.optionConfig || {};
          let prevIds: string[] = [];
          let nextIds: string[] = [];
          let desc = "Changed " + label + ": ";
          v.reduce((desc, audit) => {
            const { previousValue, nextValue } = audit;

            if (previousValue !== "undefined") {
              try {
                prevIds = JSON.parse(previousValue);
              } catch {
                prevIds.push(previousValue);
              }
            }
            try {
              nextIds = JSON.parse(nextValue);
            } catch {
              nextIds.push(nextValue);
            }
            return desc;
          }, "");
          const previousDescription = (prevIds || []).reduce((prevDesc, id) => {
            const record = data.get(id);
            prevDesc += get(record, labelPrefixRoot, "") + " " + get(record, labelKey, "");
            return prevDesc;
          }, " ");
          const nextDescription = (nextIds || []).reduce((nextDesc, id) => {
            const record = data.get(id);
            nextDesc += get(record, labelPrefixRoot, "") + " " + get(record, labelKey, "");
            return nextDesc;
          }, "");
          !isEmpty(previousDescription.trim()) && (desc += "Removed: " + previousDescription);
          !isEmpty(previousDescription.trim()) && !isEmpty(nextDescription) && (desc += " | ");
          !isEmpty(nextDescription) && (desc += "Added: " + nextDescription);
          return desc;
        }

        const description: Partial<Record<FBInputType | "default", () => React.ReactNode>> = {
          purchaseorder: () => isPurchaseorder(),
          inlineapproval: () => "Approved",
          checkboxgroup: () => isCheckGroup(),
          textfield: () => isSimple(),
          texteditor: () => isSimple(),
          datepicker: () => isSimple(),
          select: () => isSimple(),
          radiogroup: () => isSimple(),
          checkbox: () => isCheck(),
          radio: () => isCheck(),
          fileupload: () => isFileupload(),
          autocomplete: () => isAutocomplete(),
          autocompleteasync: () => isAutocomplete(),
          default: () => undefined,
        };

        const desc = (description[type || ""] || description.default)();
        if (!desc) { return; }
        return {
          ownerName: v[0].owner.user.name,
          formattedTime: getFormattedDateString(v[0].timestamp, MomentFormats.DateTimeAlt),
          description: desc,
          timestamp: v[0].timestamp,
          type,
        };
      });

      const compactMapped = sortBy(compact(mapped), "timestamp");
      const approvals = filter(compactMapped,  ({ type, timestamp }) =>
        type === "inlineapproval" || type === "requestapproval"
      );


      // TODO: refacoring & sync approveAt with createdAt
      let startDate = last(approvals)?.timestamp || (new Date()).toISOString();
      if (moment(startDate).subtract(1, "seconds").isAfter(moment(createdAt)) && approvals[approvals.length - 2]) {
        startDate = approvals[approvals.length - 2].timestamp;
      }

      const lastChange = last(compactMapped)?.timestamp;
      const endDate = releasedAt ? new Date(releasedAt) : (lastChange ? new Date(lastChange) : Date.now());

      const filteredMapped = filter(compactMapped, (cm) => (
        startDate &&
        new Date(cm.timestamp) >= new Date(startDate) &&
        new Date(cm.timestamp) <= new Date(endDate)
      ));
      return filteredMapped as FBAuditData[];
    }

    function isApproved(): boolean {
      let hasValue = type === "inlineapproval"
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
      approvalNonVersioned,
      audits,
      loading,
      index,
      name,
      type,
    });
  };

  return (props: T) => Comp(props);
};
