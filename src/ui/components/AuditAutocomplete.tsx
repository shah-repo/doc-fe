import { CircularProgress } from "@material-ui/core";
import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { Audit } from "../../state/ducks/audit";
import { FB, FBAutocompleteAsyncState } from "../form.builder";
import FBAutocompleteAsyncStore from "../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
  loading?: boolean;
}

export type Props = OwnProps;

export const AuditAutocomplete: React.FunctionComponent<Props> = ({
  audit, loading,
}) => {

  const autocompleteState = FB.useRef(FBAutocompleteAsyncState);
  const { nextValue, previousValue } = audit;
  let label = "";
  const { optionId = "", multiple = false } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;
  if (!auditValue || auditValue === "undefined") {
    auditValue = previousValue;
  }

  useObserver(() => {
    loading = FBAutocompleteAsyncStore.loading.get(optionId);
  });

  autocompleteState?.setOptionId(optionId);
  const data = FBAutocompleteAsyncStore.data.get(optionId);
  if (data) {
    const { labelKey = "text", labelPrefixRoot = "" } =
    autocompleteState?.optionConfig || {};
    if (!multiple) {
      const record = data.get(auditValue);
      label = get(record, labelPrefixRoot, "") + " " + get(record, labelKey, "");
    } else {
      let arrayValue: string[] = [];
      try {
        arrayValue = JSON.parse(auditValue);
      } catch {
        arrayValue.push(auditValue);
      }
      label = arrayValue.reduce((label, value) => {
        const record = data.get(value);
        label += get(record, labelPrefixRoot, "") + " " + get(record, labelKey, "");
        return label;
      }, "");
    }
  }

  return (
    <Fragment>
      {loading && <CircularProgress size={12} />}
      {!loading && <div>{label}</div>}
    </Fragment>
  );
};

export default AuditAutocomplete;
