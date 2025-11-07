import { reaction } from 'mobx';
import React from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { DocumentRevision } from '../../state/ducks/documentRevisions/types';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '../form.builder';
import FBAutocompleteAsyncStore from '../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditShippingCustomer: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { });
  const [value, setValue] = React.useState(auditValue);
  React.useEffect(() => {
    if (!FBAutocompleteAsyncStore.getValue<DocumentRevision>(FBAutocompleteAsyncOption.shippingInformation, auditValue)) {
      autocompleteAsyncState.fetchAutocompleteOption(auditValue as string, FBAutocompleteAsyncOption.shippingInformation);
    } else {
      const data = FBAutocompleteAsyncStore.getValue<DocumentRevision>(FBAutocompleteAsyncOption.shippingInformation, auditValue);
      setValue(`${data?.document.docId} ${data?.name}`);
    }
  }, [auditValue]);
  // MARK: @methods
  React.useEffect(() => reaction(
    () => autocompleteAsyncState?.autocompleteValueApi.data,
    (data) => {
      setValue(`${data?.document.docId} ${data?.name}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return (
    <div data-cy={dataCy}>
      {value}
    </div>
  );
};

export default AuditShippingCustomer;
