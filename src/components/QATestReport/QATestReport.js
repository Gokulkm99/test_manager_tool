import React from 'react';
import QATestReportUI from './QATestReportUI';
import useQATestReportFunctionality from './QATestReportFunctionality';

const QATestReport = ({ hasAccess }) => {
  const props = useQATestReportFunctionality();
  return <QATestReportUI {...props} hasAccess={hasAccess} />;
};

export default QATestReport;