import React from 'react';
import QATestReportUI from './QATestReportUI';
import useQATestReportFunctionality from './QATestReportFunctionality';

const QATestReport = ({ hasAccess }) => {
  const functionality = useQATestReportFunctionality();
  return <QATestReportUI hasAccess={hasAccess} {...functionality} />;
};

export default QATestReport;