import React from 'react';
import UserManagerUI from './UserManagerUI';
import useUserManagerLogic from './UserManagerLogic';

const UserManager = () => {
  const logicProps = useUserManagerLogic();
  return <UserManagerUI {...logicProps} />;
};

export default UserManager;