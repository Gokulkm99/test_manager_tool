import React from 'react';
import DashboardUI from './DashboardUI';
import useDashboardLogic from './DashboardLogic';

const Dashboard = () => {
  const logicProps = useDashboardLogic();
  return <DashboardUI {...logicProps} />;
};

export default Dashboard;