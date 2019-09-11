import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators, ActionCreator } from "redux";

/* const useActionCreator = <A extends (...args: any) => any> (
  action: A,
  ...args: Parameters<A>
) => {
  const dispatch = useDispatch();

  return useMemo(() => {
    console.log("Create action");
    return (...args: Parameters<A>) => dispatch(action(...args));
  }, [dispatch]);
};

export default useActionCreator; */

const useActionCreator = <A> (
  action: ActionCreator<A>,
) => {
  const dispatch = useDispatch();

  return useMemo(() => {
    console.log("Create action");
    return bindActionCreators(action, dispatch)
  }, [dispatch]);
};

export default useActionCreator;