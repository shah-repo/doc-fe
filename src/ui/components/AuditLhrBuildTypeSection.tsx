import { reaction } from 'mobx';
import React from 'react';
import { useIntl } from 'react-intl';
import { Audit } from '../../state/ducks/audit/types';
import { LHRBuild } from '../administration/general.settings/panels/LHRBuild/types';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '../form.builder';
import FBAutocompleteAsyncStore from '../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditLhrBuildTypeSection: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const intl = useIntl();
  const previousUUID = FB.isUUID(audit.previousValue as string) ? audit.previousValue as string : undefined;
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { optionId: FBAutocompleteAsyncOption.buildType });

  const resolveLabel = (uuid: string): string => {
    const data = FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, uuid);
    return data ? `${data.displayLabel}` : uuid;
  };

  const [nextLabel, setNextLabel] = React.useState(() => auditValue ? resolveLabel(auditValue) : '');
  const [prevLabel, setPrevLabel] = React.useState(() => previousUUID ? resolveLabel(previousUUID) : undefined);

  React.useEffect(() => {
    if (auditValue && !FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.buildType, auditValue)) {
      autocompleteAsyncState.load();
    }
  }, [auditValue]);

  React.useEffect(() => {
    return reaction(
      () => ({
        next: auditValue ? FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, auditValue) : undefined,
        prev: previousUUID ? FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, previousUUID) : undefined,
      }),
      ({ next, prev }) => {
        if (next) setNextLabel(String(next.displayLabel ?? ''));
        if (prev) setPrevLabel(String(prev.displayLabel ?? ''));
      },
    );
  }, []);

  if (prevLabel && previousUUID) {
    return <div data-cy={dataCy}>{intl.formatMessage({ id: 'documentRevision.audit.formInput.lhr-build-type.from.to' }, { from: prevLabel, to: nextLabel })}</div>;
  }
  return <div data-cy={dataCy}>{nextLabel}</div>;
};

export default AuditLhrBuildTypeSection;
