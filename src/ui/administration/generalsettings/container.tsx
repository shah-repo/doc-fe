import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RouteParams } from '../../documentType/utils/types';
import GeneralSettingsPresenter from './presenter';

const GeneralSettingsContainer: React.FunctionComponent<RouteComponentProps<RouteParams>> = ({
	match
}) => {
	const { categoryName, docTypeId, label } = match.params;
	console.log('----categoryName----', { categoryName, label, match }, match.params);

	// const onSaveChanges = () => {

	// };

	return (
		<GeneralSettingsPresenter />
	);
};

export default GeneralSettingsContainer;
