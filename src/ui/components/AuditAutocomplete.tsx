import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { Fragment, useEffect, useState } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { FB, FBAutocompleteAsyncState } from '../form.builder';
import FBAutocompleteAsyncStore from '../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';

interface OwnProps {
  audit: Audit
  dataCy?: string
  loading?: boolean
}

type Props = OwnProps;

interface OptionProps {
  label: string
  optionId: string
}

const RenderOption: React.FC<OptionProps> = ({ label, optionId }) => {
  const autocompleteState = FB.useRef(FBAutocompleteAsyncState);
  const [option, setOption] = useState(label);

  useEffect(() => {
    if (FB.isUUID(label)) {
      autocompleteState?.setOptionId(optionId);
      autocompleteState.fetchDepricatedAutocompleteOption(label);
    }
  }, []);

  useEffect(
    () =>
      reaction(
        () => autocompleteState?.autocompleteValueApi?.data,
        (data) => {
          if (!data) return;
          const { id } = data || {};
          const preparedData = autocompleteState?.prepareData([data])?.at(0) ?? data;
          FBAutocompleteAsyncStore.add(optionId, id, preparedData);
          const { labelKey = 'text', labelPrefixRoot = '' } = autocompleteState?.optionConfig || {};
          const optionLabel = `${get(preparedData, labelPrefixRoot, '')} ${FB.stripTags(get(preparedData, labelKey, ''))}`;
          setOption(optionLabel);
        },
      ),
    [],
  );

  return (<div>{option}</div>);
};

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
      {!loading && <RenderOption {...{ label, optionId }} />}
    </Fragment>
  );
};

export default AuditAutocomplete;
