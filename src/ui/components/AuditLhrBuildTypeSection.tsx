import { reaction } from 'mobx';
import React from 'react';
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
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { });
  const [value, setValue] = React.useState(auditValue);
  React.useEffect(() => {
    if (!FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, auditValue)) {
      autocompleteAsyncState.fetchAutocompleteOption(auditValue as string, FBAutocompleteAsyncOption.buildType);
    } else {
      const data = FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, auditValue);
      setValue(`${data?.internalType}`);
    }
  }, [auditValue]);

  React.useEffect(() => {
    return reaction(
      () => autocompleteAsyncState?.autocompleteValueApi.data,
      (data) => {
        const build = data as LHRBuild | undefined;
        setValue(String(build?.internalType ?? ''));
      },
    );
  }, []);

  return (
    <div data-cy={dataCy}>
      {value}
    </div>
  );
};

export default AuditLhrBuildTypeSection;
