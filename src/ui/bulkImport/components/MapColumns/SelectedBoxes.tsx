import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { translate } from '../../../../common/intl';
import { CustomHeaderEntity, SystemHeaderEntity } from '../../../../state/ducks/bulkImport/types';
import ListBoxItems from '../ListBoxItems';
import SourceDataList from '../ListBoxItems/SourceDataList';
import TargetDataList from '../ListBoxItems/TargetDataList';
import { InitialValues } from './SourceTarget';
import useStyles from './styles';

interface SelectedBoxesProps {
  customHeaders: CustomHeaderEntity[]
  systemHeaders: SystemHeaderEntity[]
}

const filterData = <T extends CustomHeaderEntity>(
  data: T[],
  searchTerm: string,
  selectedValues: InitialValues | null = null,
): T[] => {
  return data.filter((item) => {
    // Check if the item's name matches the search term.
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    // If selectedValues is provided and not empty, additionally check if the item is not selected.
    if (selectedValues && Object.keys(selectedValues).length > 0) {
      const isSelected = Object.values(selectedValues).includes(item.id);
      return matchesSearchTerm && !isSelected;
    }

    // If no selectedValues provided, just filter by search term match.
    return matchesSearchTerm;
  });
};

const SelectedBoxes: React.FC<SelectedBoxesProps> = ({ customHeaders, systemHeaders }) => {
  const classes = useStyles();
  const [searchSourceData, setSearchSourceData] = useState<string>('');
  const [searchTargetData, setSearchTargetData] = useState<string>('');
  const formData = useFormikContext();

  const handleSourceSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSourceData(event.target.value);
  };

  const handleTargetSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTargetData(event.target.value);
  };

  if (!customHeaders) return null;

  // Filter the data based on the search term
  const filteredCustomData = filterData(customHeaders, searchSourceData, formData?.values as InitialValues);
  const filteredSystemData = filterData(systemHeaders, searchTargetData);

  return (
    <Box className={classes.container}>
      <ListBoxItems title={translate('bulkImport.mapColumns.table.sourceData')} handleSearchChange={handleSourceSearchChange} searchTerm={searchSourceData}>
        <SourceDataList data={filteredCustomData} />
      </ListBoxItems>
      <ListBoxItems title={translate('bulkImport.mapColumns.table.targetData')} handleSearchChange={handleTargetSearchChange} searchTerm={searchTargetData}>
        <TargetDataList data={filteredSystemData} options={customHeaders} />
      </ListBoxItems>
    </Box>
  );
};

export default SelectedBoxes;
