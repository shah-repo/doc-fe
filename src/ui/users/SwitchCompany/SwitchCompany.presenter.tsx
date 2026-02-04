import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment } from '@material-ui/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as MobileSwtichClose } from '../../../assets/images/modelClose.svg';
import { translate } from '../../../common/intl';
import { TextField } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import rowstyle from './SwitchCompany.module.css';
import { styles } from './SwitchCompany.styles';
interface Props {
  numberOfCompanies: number
  value: string | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ children, numberOfCompanies, onChange, value }) => {
  const classes = styles();
  const history = useHistory();

  const handleClose = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>

      <div className={classes.container}>
        <MobileSwtichClose className= {classes.switchclosemobile} onClick={handleClose} />
        <div id="switchCompanyHeader" className={classes.title}>
          <Text translation="company.switch.company" />
        </div>
        <div className={classes.subtitle}>
          <Text translation="company.switch.subtitle" />
        </div>
        <div className={classes.search}>
          <TextField
            value={value}
            placeholder={translate('common.search')}
            onChange={onChange}
            autoFocus
            inputProps={{ className: classes.searchInput }}
            startAdornment={
              <InputAdornment position="start">
                <FontAwesomeIcon icon={regular('search')} />
              </InputAdornment>
            }
          />
        </div>
        <div className={numberOfCompanies > 5 ? rowstyle.customRows : classes.lessThentwo}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SwitchCompanyPresenter;
