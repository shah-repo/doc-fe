import React from 'react';
import { SettingsPanelProps } from '../../types';
import LCPGrid from './components/treelist';

const LCPSettings: React.FC<SettingsPanelProps> = (props) => {
  return <LCPGrid {...props} />;
};

export default LCPSettings;
