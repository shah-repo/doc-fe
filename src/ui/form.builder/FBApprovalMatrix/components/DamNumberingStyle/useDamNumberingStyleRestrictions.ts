import { useEffect, useRef, useState } from 'react';
import { documentTypeActions } from '../../../../../state/ducks/documentRevisions/documentType';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { DamNumberingStyleRestrictions } from '../../../FBApprovalMatrixField/FBApprovalMatrixField.state';

export const useDamNumberingStyleRestrictions = () => {
  const [restrictions, setRestrictions]
    = useState<DamNumberingStyleRestrictions | undefined>();

  const hasFetchedRef = useRef(false);

  const loadRestrictions = useActionCreator(
    documentTypeActions.fetchDamNumberingStyleRestrictions,
  );

  const async = useAsync({
    onSuccess: (response) => {
      setRestrictions(response as DamNumberingStyleRestrictions);
    },
  });

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;

      async.start(loadRestrictions, async);
    }
  }, [loadRestrictions]);

  return {
    restrictions,
  };
};
