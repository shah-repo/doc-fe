import React from 'react';
import FBTextField from '../FBTextField/FBTextField';

const FBSalesOrderNumber: React.FC<any> = (props) => {
  return (
    <>
    <FBTextField {...props} />
    </>
  );
};

export default FBSalesOrderNumber;
