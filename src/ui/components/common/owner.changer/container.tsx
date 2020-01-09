import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EMPLOYEES_URL } from "../../../../state/ducks/userManagement/constants";
import { ApplicationState } from "../../../../state/reducers";
import { asyncRequest, getUrlandSelector } from "./helpers";
import OwnerChangerPresenter from "./presenter";

export interface OwnProps {
  requestId: string;
  requestType: string;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({
  requestId,
  requestType,
}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, selector] = getUrlandSelector(requestType, requestId);
  const current = useSelector((state: ApplicationState) =>
    selector(state, requestId),
  );

  const updateOwner = async (ownerId) => {
    setLoading(true);
    const ownerData = {
      owner: {
        id: ownerId,
      },
    };
    const response = await asyncRequest("patch", url, ownerData);
    if (response.status === 200) {
      window.location.reload();
    }
    if (response) {
      setLoading(false);
    }
  };

  const queryEmployees = async () => {
    const response = await asyncRequest("get", EMPLOYEES_URL, {});

    setEmployees(
      response.data.map((employee) => ({
        value: employee.id,
        text: employee.user.name,
      })),
    );
  };

  useEffect(() => {
    queryEmployees();
  }, []);

  return (
    <OwnerChangerPresenter
      currentOwner={current.owner}
      employees={employees}
      updateOwner={updateOwner}
      loading={loading}
    />
  );
};

export default OwnerChangerContainer;
