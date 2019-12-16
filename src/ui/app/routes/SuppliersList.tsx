import React from "react";
import { SUPPLIERS_ROOT_URL } from "../../constants/urls";
import { Translation } from "../../translations/types";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const SuppliersListLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const docTypes = [
    {
      createdAt: "2019-12-16T09:19:39.612Z",
      updatedAt: "2019-12-16T09:19:39.612Z",
      id: "a7d4537c-935c-45a4-966d-f5266201d680",
      documentTypeName: "Page Details Example",
      documentTypeAcronym: "PDE",
      group: "OTHER",
      privateNumberPool: false,
      startingNumber: 1,
      pageDetails: {
        addNew: {
          label: "Label",
        },
        columns: [
          {
            label: "Label",
            fieldName: "Field Name",
          },
        ],
      },
    },
  ];

  return (
    <>
      {
        docTypes.map((docType: any) => (
          <NavigationLinkContainer
            url={`${SUPPLIERS_ROOT_URL}/${docType.id}`}
            text={docType.documentTypeName as Translation}
            currentPath={pathname}
          />
        ))
      }
    </>
  );
};

export default SuppliersListLink;
