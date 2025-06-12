import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';

// Set workerSrc for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const useQATestReportFunctionality = () => {
  // State for project details
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('');
  const [tester, setTester] = useState('');
  const [environment, setEnvironment] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [testType, setTestType] = useState('');
  const [changeId, setChangeId] = useState('');
  const [browser, setBrowser] = useState('');
  const [status, setStatus] = useState('Completed');
  const [summary, setSummary] = useState('The QA team tested {{Project Name}} to ensure its functionality, reliability, and performance. This report summarizes the test results and any issues encountered during testing.');
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [conclusion, setConclusion] = useState('');

  // Dropdown options
  const environmentOptions = ['Development', 'Staging', 'Production'];
  const testTypeOptions = ['Functional', 'Regression', 'Performance', 'Security'];
  const browserOptions = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const testResultTypes = ['Bug', 'Feature', 'Change Request'];
  const testResultStatuses = ['Pass', 'Fail', 'Blocked'];
  const testResultPriorities = ['High', 'Medium', 'Low'];

  // Replace {{Project Name}} in summary
  useEffect(() => {
    if (projectName) {
      setSummary((prev) => prev.replace(/{{Project Name}}/g, projectName));
    }
  }, [projectName]);

  // Handlers
  const handleAddTestCase = (description) => {
    setTestCases([...testCases, { id: uuidv4(), description }]);
  };

  const handleEditTestCase = (id, description) => {
    setTestCases(testCases.map((tc) => (tc.id === id ? { ...tc, description } : tc)));
  };

  const handleDeleteTestCase = (id) => {
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const handleCopyTestCase = (testCase) => {
    navigator.clipboard.writeText(testCase.description);
    alert('Test case copied to clipboard!');
  };

  const handleReorderTestCases = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(testCases);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTestCases(reordered);
  };

  const handleAddTestResult = (result) => {
    setTestResults([...testResults, { id: uuidv4(), ...result }]);
  };

  const handleDeleteTestResult = (id) => {
    setTestResults(testResults.filter((tr) => tr.id !== id));
  };

  const handleAddIssue = (issue) => {
    setIssues([...issues, { id: uuidv4(), ...issue }]);
  };

  const handleDeleteIssue = (id) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  const handleDownloadPDF = () => {
    // Validate mandatory fields
    if (!projectName || !tester || !environment || !startDate || !endDate || !testType || !browser || !status) {
      alert('Please fill all mandatory fields.');
      return;
    }

    const doc = new jsPDF();
    let yOffset = 20;

    // Cover Page
    doc.setFontSize(24);
    doc.text('CAPARIZON TEST REPORT', 105, yOffset, { align: 'center' });
    yOffset += 20;
    doc.setFontSize(18);
    doc.text(projectName, 105, yOffset, { align: 'center' });
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Version: ${version || 'N/A'}`, 105, yOffset, { align: 'center' });
    yOffset += 10;
    doc.text(`Prepared by: ${tester}`, 105, yOffset, { align: 'center' });
    yOffset += 10;
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 105, yOffset, { align: 'center' });
    doc.addPage();

    // Project Details
    yOffset = 20;
    doc.setFontSize(16);
    doc.text('Project Details', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Project Name: ${projectName}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Version: ${version || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Tester: ${tester}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Environment: ${environment}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Start Date: ${startDate ? startDate.toLocaleDateString('en-GB') : 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`End Date: ${endDate ? endDate.toLocaleDateString('en-GB') : 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Type of Test: ${testType}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Change ID: ${changeId || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Browser: ${browser}`, 20, yOffset);
    yOffset += 10;
    doc.setTextColor(status === 'Completed' ? '0, 128, 0' : '255, 0, 0');
    doc.text(`Status: ${status}`, 20, yOffset);
    doc.setTextColor(0);
    yOffset += 20;

    // Summary
    doc.setFontSize(16);
    doc.text('Summary', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(summary, 20, yOffset, { maxWidth: 170 });
    yOffset += 30;

    // Test Cases
    doc.setFontSize(16);
    doc.text('Test Cases', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    testCases.forEach((tc, i) => {
      doc.text(`${i + 1}. ${tc.description}`, 20, yOffset, { maxWidth: 170 });
      yOffset += 10;
    });
    yOffset += 10;

    // Test Results
    doc.setFontSize(16);
    doc.text('Test Results', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.autoTable({
      startY: yOffset,
      head: [['No', 'Ticket ID', 'Type', 'Status', 'Priority']],
      body: testResults.map((tr, i) => [i + 1, tr.ticketId, tr.type, tr.status, tr.priority]),
    });
    yOffset = doc.lastAutoTable.finalY + 20;

    // Issues Identified
    doc.setFontSize(16);
    doc.text('Issues Identified', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.autoTable({
      startY: yOffset,
      head: [['No', 'Ticket', 'Description']],
      body: issues.map((issue, i) => [i + 1, issue.ticket, issue.description]),
    });
    yOffset = doc.lastAutoTable.finalY + 20;

    // Notes
    doc.setFontSize(16);
    doc.text('Notes', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(notes || 'N/A', 20, yOffset, { maxWidth: 170 });
    yOffset += 30;

    // Recommendations
    doc.setFontSize(16);
    doc.text('Recommendations', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(recommendations || 'N/A', 20, yOffset, { maxWidth: 170 });
    yOffset += 30;

    // Conclusion
    doc.setFontSize(16);
    doc.text('Conclusion', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(conclusion || 'N/A', 20, yOffset, { maxWidth: 170 });
    yOffset += 20;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(status === 'Completed' ? '0, 128, 0' : '255, 0, 0');
    doc.text(`The Testing has been completed and it is ${status === 'Completed' ? 'Passed' : 'Failed'}.`, 20, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);

    // Save PDF
    doc.save(`${projectName}_Test_Report.pdf`);
  };

  const handleUploadPDF = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n';
    }

    // Extract fields
    const extractField = (label, text) => {
      const regex = new RegExp(`${label}\\s*[:]?\\s*([^\\n]+)`);
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    setProjectName(extractField('Project Name', text));
    setVersion(extractField('Version', text));
    setTester(extractField('Tester', text));
    setEnvironment(extractField('Environment', text));
    setTestType(extractField('Type of Test', text));
    setChangeId(extractField('Change ID', text));
    setBrowser(extractField('Browser', text));
    setStatus(extractField('Status', text));

    // Parse dates
    const startDateMatch = text.match(/Start Date\s*[:]? (\d{2}\/\d{2}\/\d{4})/);
    const endDateMatch = text.match(/End Date\s*[:]? (\d{2}\/\d{2}\/\d{4})/);
    if (startDateMatch) setStartDate(new Date(startDateMatch[1].split('/').reverse().join('-')));
    if (endDateMatch) setEndDate(new Date(endDateMatch[1].split('/').reverse().join('-')));

    // Parse summary, notes, recommendations, conclusion
    const summaryMatch = text.match(/Summary\s*([\s\S]*?)(Test Cases|$)/);
    if (summaryMatch) setSummary(summaryMatch[1].trim());

    const notesMatch = text.match(/Notes\s*([\s\S]*?)(Recommendations|$)/);
    if (notesMatch) setNotes(notesMatch[1].trim());

    const recommendationsMatch = text.match(/Recommendations\s*([\s\S]*?)(Conclusion|$)/);
    if (recommendationsMatch) setRecommendations(recommendationsMatch[1].trim());

    const conclusionMatch = text.match(/Conclusion\s*([\s\S]*?)(The Testing has been completed|$)/);
    if (conclusionMatch) setConclusion(conclusionMatch[1].trim());

    // Parse test cases
    const testCasesMatch = text.match(/Test Cases\s*([\s\S]*?)(Test Results|$)/);
    if (testCasesMatch) {
      const testCaseLines = testCasesMatch[1].match(/\d+\.\s*([^\n]+)/g) || [];
      setTestCases(testCaseLines.map((line) => ({
        id: uuidv4(),
        description: line.replace(/^\d+\.\s*/, '').trim(),
      })));
    }

    // Parse test results
    const testResultsMatch = text.match(/Test Results\s*No\s*Ticket ID\s*Type\s*Status\s*Priority\s*([\s\S]*?)(Issues Identified|$)/);
    if (testResultsMatch) {
      const resultLines = testResultsMatch[1].split('\n').filter((line) => line.match(/^\d+\s/));
      setTestResults(resultLines.map((line) => {
        const parts = line.trim().split(/\s+/);
        const no = parts[0];
        const ticketId = parts[1];
        const type = parts[2];
        const status = parts[3];
        const priority = parts[4];
        return { id: uuidv4(), ticketId, type, status, priority };
      }));
    }

    // Parse issues
    const issuesMatch = text.match(/Issues Identified\s*No\s*Ticket\s*Description\s*([\s\S]*?)(Notes|$)/);
    if (issuesMatch) {
      const issueLines = issuesMatch[1].split('\n').filter((line) => line.match(/^\d+\s/));
      setIssues(issueLines.map((line) => {
        const parts = line.trim().split(/\s+/);
        const no = parts[0];
        const ticket = parts[1];
        const description = parts.slice(2).join(' ');
        return { id: uuidv4(), ticket, description };
      }));
    }
  };

  return {
    projectName,
    setProjectName,
    version,
    setVersion,
    tester,
    setTester,
    environment,
    setEnvironment,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    testType,
    setTestType,
    changeId,
    setChangeId,
    browser,
    setBrowser,
    status,
    setStatus,
    summary,
    setSummary,
    testCases,
    setTestCases,
    testResults,
    setTestResults,
    issues,
    setIssues,
    notes,
    setNotes,
    recommendations,
    setRecommendations,
    conclusion,
    setConclusion,
    environmentOptions,
    testTypeOptions,
    browserOptions,
    testResultTypes,
    testResultStatuses,
    testResultPriorities,
    handleAddTestCase,
    handleEditTestCase,
    handleDeleteTestCase,
    handleCopyTestCase,
    handleReorderTestCases,
    handleAddTestResult,
    handleDeleteTestResult,
    handleAddIssue,
    handleDeleteIssue,
    handleDownloadPDF,
    handleUploadPDF,
  };
};

export default useQATestReportFunctionality;