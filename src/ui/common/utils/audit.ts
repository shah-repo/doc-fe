import { get, isString } from 'lodash';
import { useObserver } from 'mobx-react';
import { translate } from '../../../common/intl';
import { Audit, LifecyclePahseOptionPayload } from '../../../state/ducks/audit/types';
import { WorkOrderTypesValues } from '../../../state/ducks/documentRevisions/documentType/types';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '../../form.builder';
import FBAutocompleteAsyncStore from '../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';

/**
 * Return nextValue only if string, otherwise it will crash FE
 * @param {any} nextValue Any audit type
 * @returns {string} nextValue if string, otherwise returns "N/A"
 */
export const getAuditDefaultValue = (nextValue: any): string => {
  if (isString(nextValue)) {
    return nextValue;
  }

  return 'N/A';
};

export const getWOAuditDefaultValue = (audit: Audit): string => {
  const { nextValue, previousValue } = audit;
  const workOrderOptionId = FBAutocompleteAsyncOption.availableParts;
  let auditValue: any = nextValue;

  if (!auditValue || auditValue === 'undefined') {
    auditValue = previousValue;
  }

  if (audit.field === 'formInput.wo_part.id') {
    const autocompleteState = FB.useRef(FBAutocompleteAsyncState);
    autocompleteState?.setOptionId(workOrderOptionId);
    const { labelKey = 'text', labelPrefixRoot = '' } = autocompleteState?.optionConfig || {};
    useObserver(() => {
      FBAutocompleteAsyncStore.loading.get(workOrderOptionId);
    });

    const data = FBAutocompleteAsyncStore.data.get(workOrderOptionId);
    let label = '';

    if (data) {
      const record = data.get(auditValue);
      label = translate('wo.displayRevision', {
        docId: get(record, labelPrefixRoot, ''),
        displayRevision: get(record, 'displayRevision', ''),
        name: FB.stripTags(get(record, labelKey, '')),
      });
    }

    return label;
  } else if (audit.field === 'formInput.work_order_type') {
    return WorkOrderTypesValues[auditValue];
  } else {
    return auditValue;
  }
};

export const getLCPAuditDefaultValue = (audit: Audit, lifecyclePhaseOptions: LifecyclePahseOptionPayload[]): string => {
  const lifecyclePahse = lifecyclePhaseOptions.find(data => data.id === audit.nextValue);
  return lifecyclePahse ? lifecyclePahse.text : 'N/A';
};
