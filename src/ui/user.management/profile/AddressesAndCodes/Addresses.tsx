import React from "react";
import EditRemoveAddFields from "./EditRemoveAddFields";


interface OwnProps {
  canUpdateCompany: boolean;
  addresses: [];
}

type Props = OwnProps;

export const Addresses: React.FunctionComponent<Props> = ({
  canUpdateCompany,
  addresses,
}) => {
  const saveChanges = () => {
    console.log(addresses);
  };

  return (
    <EditRemoveAddFields
      canUpdateCompany={canUpdateCompany}
      saveChanges={saveChanges}
      noValueLabel="user.management.no.addresses.specified"
      label="user.management.addresses"
      editLabel="user.management.edit.address"
      addLabel="user.management.add.addresses"
      title="user.management.addresses"
      placeholder="New Address"
      addFieldButtonLabel="user.management.add.address"
      fields={addresses}
    />
  );
};

export default Addresses;
