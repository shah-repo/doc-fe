import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ActionCreator, bindActionCreators } from "redux";

const useActionCreator = <A> (
  action: ActionCreator<A>,
) => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(action, dispatch);
  }, [dispatch, action]);
};

export default useActionCreator;
