import React from 'react';

const Filter: React.FC = (props) => {
  const { children } = props;

  return (
    <div className="k-filtercell">
      {children}
    </div>
  );
};

export default Filter;
