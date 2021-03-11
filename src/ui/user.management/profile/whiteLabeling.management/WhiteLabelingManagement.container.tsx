import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { Company, companyActions, companySelectors } from "../../../../state/ducks/company";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetHasTag from "../../../hooks/useGetHasTag";
import { toWhiteLabelingBodyValues, toWhiteLabelingInitialValues } from "../../utils/transform";
import WhiteLabelingManagementPresenter from "./WhiteLabelingManagement.presenter";

export const WhiteLabelingManagementContainer: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();

  const [s3link, sets3link] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const whiteLabeling = useSelector(companySelectors.getAllWhiteLabeling);
  const initialValues = toWhiteLabelingInitialValues(whiteLabeling);
  const canManageWhiteLabeling = useGetHasTag(GroupTag.COMPANY_CONFIG_WHITELABELING);

  const async = useAsync({
    onSuccess: (data?: Company) => {
      if (!data) {
        return;
      }
      dispatch(companyActions.selectCompany(data));
    },
  });
  const asyncS3link = useAsync({
    onSuccess: (data: any) => {
      const url = data.url;
      sets3link(url.substr(0, url.indexOf("?")));
      if (!file) {
        return;
      }
      dispatch(attachmentsActions.uploadImage(url, file));
    },
  });

  if (!canManageWhiteLabeling) {
    return null;
  }

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    setFile(file);
    if (!file) {
      return;
    }
    dispatch(attachmentsActions.requestAvatarS3link(file.name, asyncS3link));
  };

  const onSubmit = (values: any) => {
    async.start(changeCompanyAction, toWhiteLabelingBodyValues(values), async);
  };

  const render = (props: FormikProps<any>) => (
    <WhiteLabelingManagementPresenter
      asyncState={async.asyncState}
      {...{ onChange, s3link }}
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

export default WhiteLabelingManagementContainer;
