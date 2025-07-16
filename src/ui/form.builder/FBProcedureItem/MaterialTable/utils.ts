import { useObserver } from 'mobx-react';
import FBAutocompleteAsyncStore from '../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { UnitOption } from './types';

export const useOptions = () => {
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

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  return {
    units,
  };
};
