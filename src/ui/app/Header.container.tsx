import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { LOGIN_URL } from "../constants/urls";
import FBStore from "../form.builder/stores/ui/FBStore";
import useGetHasTag from "../hooks/useGetHasTag";
import HeaderPresenter from "./Header.presenter";
import NewHeaderPresenter from "./NewHeader.presenter";

type Props = RouteComponentProps;

interface UserMenuContext {
  handleLogout: () => void;
  hasMultipleCompanies: boolean;
  handleSwitchCompany: () => void;
}

export let UserMenuContext = React.createContext<UserMenuContext | undefined>(undefined);

const HeaderContainer: React.FunctionComponent<Props> = ({
  location,
  history,
}) => {
  const isNewDashboard = location.pathname === "/dashboard";
  const name = useSelector(authSelectors.currentUserName);
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  };

  const hasMultipleCompanies = useSelector(authSelectors.hasMultipleCompanies);
  const customLabelsValue = useSelector(authSelectors.isCustomLabelsOn);

  /** Handles click on the Switch Company button. */
  const handleSwitchCompany = () => {
    history.push(LOGIN_URL);
    FBStore.clearStores();
  };

  UserMenuContext = React.createContext<UserMenuContext | undefined>({
    handleLogout,
    hasMultipleCompanies,
    handleSwitchCompany,
  });

  const toggleCustomLabels = () => {
    dispatch(authActions.toggleCustomLabels(!customLabelsValue));
  };

  return (
    <>
      {isNewDashboard && <NewHeaderPresenter
        {...{
          name,
          customLabelsValue,
          toggleCustomLabels,
          canToggleCustomLabels,
        }}
      />}
      {!isNewDashboard && <HeaderPresenter
        {...{
          customLabelsValue,
          toggleCustomLabels,
          canToggleCustomLabels,
        }}
      />}
    </>
  );
};

export default withRouter(HeaderContainer);
