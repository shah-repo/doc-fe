import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as MobileSwtichClose } from '../../../assets/images/modelClose.svg';
import Text from '../../components/Text';
import rowstyle from './SwitchCompany.module.css';
import { styles } from './SwitchCompany.styles';
interface Props {
  numberOfCompanies: number
}

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ children, numberOfCompanies }) => {
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
        <div className={numberOfCompanies > 5 ? rowstyle.customRows : rowstyle.lessThentwo}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SwitchCompanyPresenter;
