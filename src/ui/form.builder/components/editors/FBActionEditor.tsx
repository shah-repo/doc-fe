import React from 'react';
import _ from 'lodash';
import FBStepper from '../common/FBStepper';
import FBCheckboxGroup from '../inputs/FBCheckboxGroup';
import actionCollection from '../../stores/domain/collections/FBActionCollection';

const FBActionEditor: React.FunctionComponent<{}> = () => {
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FBCheckboxGroup
            name="actions"
            label="Actions"
            row={true}
            optionLabelKey="description"
            optionValueKey="name"
            options={actionCollection.data()}
          />
        );
      case 1:
        //   const actionType = _.get(form.values, "action");
        //   if (!_.isUndefined(actionType)) {
        //     const InputType = FBActionComponent[actionType];
        //     return <InputType />;
        //   }
        return 'Please select the action first.';
      default:
        return 'Unknown step';
    }
  };

  return (
    <FBStepper
      steps={['Select action', 'Set config']}
      getStepContent={getStepContent}
    />
  );
};

export default FBActionEditor;
