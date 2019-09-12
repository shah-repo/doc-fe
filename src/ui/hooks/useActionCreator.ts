import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators, ActionCreator } from "redux";

const useActionCreator = <A> (
  action: ActionCreator<A>,
) => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(action, dispatch)
  }, [dispatch]);
};

export default useActionCreator;