import React from "react";
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

  const saveChanges = () => {
    console.log(acctCodes);
  };

  return (
    <EditRemoveAddFields
      canUpdateCompany={canUpdateCompany}
      saveChanges={saveChanges}
      noValueLabel="user.management.no.codes.specified"
      label="user.management.codes"
      editLabel="user.management.edit.codes"
      addLabel="user.management.add.codes"
      title="user.management.codes"
      placeholder="New Acct Code"
      addFieldButtonLabel="user.management.add.code"
      fields={acctCodes}
    />
  );
};

export default AcctCodes;
