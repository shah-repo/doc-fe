import { useObserver } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { translate } from '../../../../common/intl';
import FBAutocompleteAsyncState from '../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../helpers';
import { MaterialOption, UnitOption } from './types';

export const useOptions = () => {
  const materialAutocompleteRef = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.materials,
  });

  const materialOptions = useObserver(() => {
    const materialMap = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials) as Map<
    string,
    MaterialOption
    >;

    return materialMap ? Array.from(materialMap.values()) : [];
  });

  const materialSelectOptions = useMemo(() => {
    return materialOptions?.map((material) => ({
      label: translate('wo.displayRevision', {
        docId: material.document.docId,
        displayRevision: material?.displayRevision,
        name: material?.name,
      }),
      value: material.id,
    }));
  }, [materialOptions]);

  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    materialAutocompleteRef.load();
    unitsAsync.load();
  }, [materialAutocompleteRef, unitsAsync]);

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    materialSelectOptions,
    units,
  };
};
