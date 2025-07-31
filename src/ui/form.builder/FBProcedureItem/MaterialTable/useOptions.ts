import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import FBAutocompleteAsyncState from '../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../helpers';
import { UnitOption } from './types';

export const useOptions = () => {
  // const materialAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
  //   optionId: FBAutocompleteAsyncOption.materials,
  // });

  // const parts = useObserver(
  //   () => {
  //     const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials) as Map<string, MaterialOption>;
  //     return asyncData ? Array.from(asyncData.values()) : [];
  //   },
  // );

  // const partOptionsData = useMemo(() => {
  //   return parts?.map((part) => ({
  //     label: translate('wo.displayRevision', {
  //       docId: part.document.docId,
  //       displayRevision: part?.displayRevision,
  //       name: part?.name,
  //     }),
  //     value: part.id,
  //   }));
  // }, [parts]);

  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    // materialAsync.load();
    unitsAsync.load();
  }, [unitsAsync]);

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    // partOptionsData,
    units,
  };
};
