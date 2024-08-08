import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { Fragment } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { FB, FBAutocompleteAsyncState } from '../form.builder';
import FBAutocompleteAsyncStore from '../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';

interface OwnProps {
  audit: Audit
  dataCy?: string
  loading?: boolean
}

type Props = OwnProps;

const AuditAutocomplete: React.FunctionComponent<Props> = ({
  audit, loading,
}) => {
  const autocompleteState = FB.useRef(FBAutocompleteAsyncState);
  const { nextValue, previousValue } = audit;
  let label = '';
  const { optionId = '', multiple: originMultiple, editorProperties } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;
  if (!auditValue || auditValue === 'undefined') {
    auditValue = previousValue;
  }

  const multiple = originMultiple ?? editorProperties?.includes('multiple') ?? false;

  useObserver(() => {
    loading = FBAutocompleteAsyncStore.loading.get(optionId);
  });

  autocompleteState?.setOptionId(optionId);
  const data = FBAutocompleteAsyncStore.data.get(optionId);

  if (data) {
    const { labelKey = 'text', labelPrefixRoot = '' } = autocompleteState?.optionConfig || {};

    const getRecordLabel = (recordId: string): string => {
      const record = data.get(recordId);

      if (!record) {
        return recordId;
      }

      return `${get(record, labelPrefixRoot, '')} ${FB.stripTags(get(record, labelKey, ''))}`;
    };

    if (!multiple) {
      label = getRecordLabel(auditValue);
    } else {
      let arrayValue: string[] = [];
      try {
        arrayValue = JSON.parse(auditValue);
      } catch {
        arrayValue.push(auditValue);
      }
      label = arrayValue.reduce((label, value) => {
        label += getRecordLabel(value);
        return label;
      }, '');
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
