import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import useGetHasTag from "../hooks/useGetHasTag";
import HeaderPresenter from "./Header.presenter";
import NewHeaderPresenter from "./NewHeader.presenter";

type Props = RouteComponentProps;

const HeaderContainer: React.FunctionComponent<Props> = ({
  location,
}) => {
  const isNewDashboard = location.pathname === "/";
  const name = useSelector(authSelectors.currentUserName);
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);
  const dispatch = useDispatch();
  const customLabelsValue = useSelector(authSelectors.isCustomLabelsOn);
  const toggleCustomLabels = () => {
    dispatch(authActions.toggleCustomLabels(!customLabelsValue));
  };
  // TODO Use single header component
  return (
    <>
      {isNewDashboard && (
        <NewHeaderPresenter
          {...{
            name,
            customLabelsValue,
            toggleCustomLabels,
            canToggleCustomLabels,
          }}
        />
      )}
      {!isNewDashboard && (
        <HeaderPresenter
          {...{
            customLabelsValue,
            toggleCustomLabels,
            canToggleCustomLabels,
          }}
        />
      )}
    </>
  );
};

export default withRouter(HeaderContainer);
