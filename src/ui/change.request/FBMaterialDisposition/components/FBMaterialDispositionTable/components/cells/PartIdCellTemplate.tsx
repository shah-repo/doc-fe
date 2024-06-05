import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../../common/intl';
import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { materialDispositionActions } from '../../../../../../../state/ducks/materialDisposition';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import useActionCreator from '../../../../../../hooks/useActionCreator';
import useAsync from '../../../../../../hooks/useAsync';
import { Colors } from '../../../../../../layout/theme-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps, EditableMDItem } from '../../types';
import { styles } from './styles';
const MIN_SEARCH_TERM_LENGTH = 3;

type ItemOptionType = {docId: string, displayRevision: string} & OptionType;

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { setFieldValue, getFieldProps } = useFormikContext<EditableMDItem>();
  const [items, setItems] = React.useState<ItemOptionType[]>([]);
  const [value, setValue] = useState<Partial<ItemOptionType>>({ label: '', value: '', docId: '', displayRevision: '' });
  const { userEnteredItemId } = dataItem;
  const isUserEnteredItemId = !isEmpty(userEnteredItemId);
  const fieldName = isUserEnteredItemId ? 'userEnteredItemId' : 'partDocRevId';
  const [inputValue, setInputValue] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const limit = 25;
  const classes = styles();
  const isEdit = dataItem[MODE_FIELD] === Mode.edit;

  const loadAllDocsListAction = useActionCreator(materialDispositionActions.loadAllDocsList);

  const loadAllDocsListAsync = useAsync({
    onSuccess: (data: {items: DocumentRevision[]} = { items: [] }) => {
      const modifiedItems = data?.items?.map((item) => ({
        label: translate('approvalRequest.material.disposition.displayRevision', { docId: item.document.docId, displayRevision: item?.displayRevision, name: item?.name }),
        value: item.id,
        docId: item.document.docId,
        displayRevision: item?.displayRevision,
      }));
      if (isEmpty(inputValue)) {
        setItems(prev => [...prev, ...modifiedItems]);
      } else {
        setItems(modifiedItems);
      }
    },
  });

  useEffect(() => {
    loadAllDocsListAsync.start(
      loadAllDocsListAction,
      offset,
      '',
      loadAllDocsListAsync,
    );
  }, [dataItem[MODE_FIELD]]);

  useEffect(() => {
    const defaultValue = isUserEnteredItemId ? { label: dataItem.userEnteredItemId ?? '' } : { label: dataItem.partDocId, value: dataItem.partDocRevId };
    const value = items.find((option) => option.value === dataItem.partDocRevId) ?? defaultValue;
    if (value && isEmpty(inputValue)) {
      setFieldValue('partDocRevId', value.value);
      setValue(value);
    }
  }, [items]);

  const handleChange = (event: ChangeEvent<unknown>, value: ItemOptionType) => {
    setFieldValue('text', undefined);
    setFieldValue('docId', value.docId);
    setFieldValue('docRevId', value.value);
    setFieldValue('displayRevision', value?.displayRevision);
    setValue(value);
  };

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string, reason: string) => {
    if (reason !== 'input') {
      return;
    }
    setFieldValue('text', inputVal);
    setInputValue(inputVal);
    if (inputVal && inputVal.length >= MIN_SEARCH_TERM_LENGTH) {
      setOffset(0);
      queryApi(0, inputVal);
    } else if (!inputVal) {
      setOffset(0);
      queryApi(0);
    }
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });
  const onScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      Math.ceil(listboxNode.scrollHeight - listboxNode.scrollTop)
    === listboxNode.clientHeight
    ) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      queryApi(nextOffset, inputValue);
    }
  };
  const queryApi = (offset: number, searchText?: string) => {
    loadAllDocsListAsync.start(
      loadAllDocsListAction,
      offset,
      searchText,
      loadAllDocsListAsync,
    );
  };

  return (
    <FormikField name={fieldName}>
      <Autocomplete
        {...getFieldProps(fieldName)}
        key={isEmpty(items) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        freeSolo
        disabled={isEdit}
        forcePopupIcon
        ListboxProps={{ onScroll }}
        options={items}
        onInputChange={debounceFunction}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        classes={{
          paper: classes.paper,
        }}
        renderOption={(option) => {
          return <div className={classes.optionWrap}>{option.label}</div>;
        }}
        onChange={handleChange}
        placeholder={translate('common.select.or.enter.placeholder')}
        size="small"
      />
    </FormikField>
  );
};

export const PartIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { partDocId, partDocRevId, userEnteredItemId } = dataItem;
  const fieldValue = dataItem[field];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const isUserEnteredItemId = !isEmpty(userEnteredItemId);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && <Tooltip title={fieldValue} placement="top-start" arrow>
        <Link
          to={documentPreviewPath(partDocRevId, partDocId)}
          target="_blank"
          className={classes.link}
        >
          {fieldValue}
        </Link>
      </Tooltip>}
      {isUserEnteredItemId && <Box display="flex" justifyContent="space-between">
        {userEnteredItemId}
        <span className={classes.nonEnlilDocInfoIcon}>
          <Tooltip
            arrow
            title={translate('approvalRequest.material.disposition.warning.non.enlil.doc')}
            placement="top"
          >
            <FontAwesomeIcon
              data-cy="non-enlil-doc"
              color={Colors.warning}
              icon={regular('circle-exclamation')}
            />
          </Tooltip>
        </span>
      </Box>
      }
    </OverflowingContent>
  );
};
