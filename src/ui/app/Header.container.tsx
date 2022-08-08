import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { HOME_URL } from "../constants/urls";
import useGetHasTag from "../hooks/useGetHasTag";
import HeaderPresenter from "./Header.presenter";

type Props = RouteComponentProps;

const HeaderContainer: React.FunctionComponent<Props> = ({
  location,
}) => {
  const fullHeight = location.pathname === HOME_URL;
  const name = useSelector(authSelectors.currentUserName);
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);
  const customLabelsValue = useSelector(authSelectors.isCustomLabelsOn);
  const dispatch = useDispatch();
  const toggleCustomLabels = () => {
    dispatch(authActions.toggleCustomLabels(!customLabelsValue));
  };

  return (
    <HeaderPresenter
      {...{
        name,
        fullHeight,
        customLabelsValue,
        toggleCustomLabels,
        canToggleCustomLabels,
      }}
    />
  );
};

export default withRouter(HeaderContainer);
