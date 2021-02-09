import { Formik, FormikProps } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { PageDetails } from "../../../state/ducks/documentRevisions/documentType";
import { pageDetailsActions } from "../../../state/ducks/pageDetails";
import { toastError } from "../../components/notifications";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { toPageDetailsBodyValues, toPageDetailsIntialValues } from "../transform";
import { PageDetailsCategory } from "../types";
import { PageDetailsFormPresenter } from "./presenter";

interface Props {
  pageDetails: PageDetails;
}

export const PageDetailsFormContainer: React.FunctionComponent<Props> = ({
  pageDetails,
}) => {
  const dispatch = useDispatch();
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
    },
  });
  const { id } = pageDetails;
  const initialValues = toPageDetailsIntialValues(pageDetails);
  const transitionLabel =  "common.delete";

  const updatePageDetailsAction = useActionCreator(pageDetailsActions.updatePageDetails);

  const onSubmit = (values) => {
    async.start(
      updatePageDetailsAction,
      id,
      toPageDetailsBodyValues(values),
      async
    );
  };

  const handleTransition = () => {
    dispatch(pageDetailsActions.deletePageDetails(id));
  };

  const render = (props: FormikProps<PageDetailsCategory>) => (
    <PageDetailsFormPresenter
      {...{ handleTransition, transitionLabel }}
      {...props}
    />
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {render}
    </Formik>
  );
};
