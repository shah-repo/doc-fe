import React from "react";
import { companyActions } from "../../../../state/ducks/company";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import EditRemoveAddFields from "./EditRemoveAddFields";


interface OwnProps {
  canUpdateCompany: boolean;
  addresses: [];
}

type Props = OwnProps;

const Addresses: React.FunctionComponent<Props> = ({
  canUpdateCompany,
  addresses,
}) => {
  const async = useAsync();
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const saveChanges = (newAddresses) => {
    async.start(changeCompanyAction, { addresses: newAddresses }, async);
  };

  return (
    <EditRemoveAddFields
      saveChanges={saveChanges}
      canUpdateCompany={canUpdateCompany}
      noValueLabel="user.management.no.addresses.specified"
      editLabel="user.management.edit.address"
      addLabel="user.management.add.addresses"
      title="user.management.addresses"
      placeholder="New Address"
      fields={addresses}
      asyncState={async.asyncState}
    />
  );
};

export default Addresses;
