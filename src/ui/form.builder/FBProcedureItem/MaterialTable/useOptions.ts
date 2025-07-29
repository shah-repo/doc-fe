import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import FBAutocompleteAsyncState from '../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../helpers';
import { MaterialOption, UnitOption } from './types';

export const useOptions = () => {
  const materialAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.materials,
  });

  const parts = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials) as Map<string, MaterialOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  // const [lots, setLots] = useState<DocumentRevision[]>([]);
  // const fetchLotsByPartId = useActionCreator(lhrSummaryActions.fetchLotsByPartId);

  // const fetchPartLotsAsync = useAsync({
  //   onSuccess: (data: DocumentRevision[] = []) => {
  //     setLots(data);
  //   },
  // });

  // useEffect(() => {
  //   partId && fetchPartLotsAsync.start(fetchLotsByPartId, partId, fetchPartLotsAsync);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [partId]);

  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    materialAsync.load();
    unitsAsync.load();
  }, [materialAsync, unitsAsync]);

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    parts,
    units,
  };
};
