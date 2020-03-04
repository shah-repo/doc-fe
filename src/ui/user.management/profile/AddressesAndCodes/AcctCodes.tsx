import React from "react";
import { companyActions } from "../../../../state/ducks/company";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import EditRemoveAddFields from "./EditRemoveAddFields";


interface OwnProps {
  canUpdateCompany: boolean;
  acctCodes: [];
}

type Props = OwnProps;

export const AcctCodes: React.FunctionComponent<Props> = ({
  canUpdateCompany,
  acctCodes,
}) => {
  const async = useAsync();
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const saveChanges = (newAcctCodes) => {
    async.start(changeCompanyAction, { acctCodes: newAcctCodes }, async);
  };

  return (
    <EditRemoveAddFields
      saveChanges={saveChanges}
      canUpdateCompany={canUpdateCompany}
      noValueLabel="user.management.no.codes.specified"
      editLabel="user.management.edit.codes"
      addLabel="user.management.add.codes"
      title="user.management.codes"
      placeholder="New Acct Code"
      fields={acctCodes}
      asyncState={async.asyncState}
    />
  );
};

export default AcctCodes;
