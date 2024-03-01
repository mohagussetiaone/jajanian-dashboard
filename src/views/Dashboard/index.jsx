import React from 'react';
import { useAuthValidation, useAuthCheck } from 'store/Auth/customHooks';

const index = ({ authToken }) => {
  // const { isValid } = useAuthCheck(authToken);
  // useAuthValidation(isValid);

  return <h1>Ini Dashboard</h1>;
};

export default index;
