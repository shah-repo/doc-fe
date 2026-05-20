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
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { optionId: FBAutocompleteAsyncOption.buildType });
  const [buildType, setBuildType] = React.useState(auditValue);
  React.useEffect(() => {
    const data = FBAutocompleteAsyncStore.getValue<LHRBuild>(FBAutocompleteAsyncOption.buildType, auditValue);
    if (!data) {
      autocompleteAsyncState.load();
    } else {
      setBuildType(`${data?.displayLabel}`);
    }
  }, [auditValue]);

  React.useEffect(() => {
    return reaction(
      () => autocompleteAsyncState?.autocompleteValueApi.data,
      (data) => {
        const build = data as LHRBuild | undefined;
        setBuildType(String(build?.displayLabel ?? ''));
      },
    );
  }, []);

  return <div data-cy={dataCy}>{buildType}</div>;
};

export default AuditLhrBuildTypeSection;
