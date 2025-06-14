import { useState, useEffect, useContext } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as pdfjsLib from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../AuthContext';
import logoImage from '../logo.png';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const useQATestReportFunctionality = () => {
  const { user } = useContext(AuthContext);
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('');
  const [tester, setTester] = useState(user?.username || '');
  const [environment, setEnvironment] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [testType, setTestType] = useState('');
  const [changeId, setChangeId] = useState('');
  const [browser, setBrowser] = useState('');
  const [status, setStatus] = useState('Pass');
  const [summary, setSummary] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [conclusion, setConclusion] = useState('The Testing has been completed and it is Pass.');
  const [projects, setProjects] = useState([]);
  const [browserOptions, setBrowserOptions] = useState([]);
  const [environmentOptions, setEnvironmentOptions] = useState([]);
  const [testTypeOptions, setTestTypeOptions] = useState([]);
  const [testResultTypes] = useState(['Functional', 'Regression', 'Integration', 'Smoke']);
  const [testResultStatuses] = useState(['Pass', 'Fail', 'Blocked']);
  const [testResultPriorities] = useState(['High', 'Medium', 'Low']);
  const [dateError, setDateError] = useState('');

  // Sync conclusion with status
  useEffect(() => {
    setConclusion(`The Testing has been completed and it is ${status}.`);
  }, [status]);

  // Validate end date
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setDateError('End Date cannot be earlier than Start Date.');
      setEndDate(null);
    } else {
      setDateError('');
    }
  }, [startDate, endDate]);

  // Refresh settings data
  const refreshSettingsData = (updatedSettings) => {
    setProjects(updatedSettings.projects || []);
    setBrowserOptions(updatedSettings.browsers || []);
    setEnvironmentOptions(updatedSettings.environments || []);
    setTestTypeOptions(updatedSettings.testTypes || []);
  };

  // Set tester from user
  useEffect(() => {
    if (user?.username) {
      setTester(user.username);
    }
  }, [user]);

  // Fetch options from database
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const projectsRes = await fetch('http://localhost:4000/api/projects');
        const projectsData = await projectsRes.json();
        if (typeof projectsData === 'object' && projectsData !== null) {
          setProjects(Object.keys(projectsData));
        } else {
          setProjects([]);
        }

        const browsersRes = await fetch('http://localhost:4000/api/browsers');
        const browsersData = await browsersRes.json();
        if (Array.isArray(browsersData)) {
          setBrowserOptions(browsersData);
        } else {
          setBrowserOptions([]);
        }

        const environmentsRes = await fetch('http://localhost:4000/api/environments');
        const environmentsData = await environmentsRes.json();
        if (Array.isArray(environmentsData)) {
          setEnvironmentOptions(environmentsData);
        } else {
          setEnvironmentOptions([]);
        }

        const testTypesRes = await fetch('http://localhost:4000/api/test-types');
        const testTypesData = await testTypesRes.json();
        if (Array.isArray(testTypesData)) {
          setTestTypeOptions(testTypesData);
        } else {
          setTestTypeOptions([]);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
        setProjects([]);
        setBrowserOptions([]);
        setEnvironmentOptions([]);
        setTestTypeOptions([]);
      }
    };
    fetchOptions();
  }, []);

  // Replace {{Project Name}} in summary
  useEffect(() => {
    if (projectName) {
      setSummary(
        `The QA team tested ${projectName} to ensure its functionality, reliability, and performance. This report summarizes the test results and any issues encountered during testing.`
      );
    } else {
      setSummary('');
    }
  }, [projectName]);

  const handleAddProject = async (projectName) => {
    try {
      const res = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_name: projectName }),
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects([...projects, newProject.main_project]);
      }
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleDeleteProject = async (projectName) => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${encodeURIComponent(projectName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects(projects.filter(p => p !== projectName));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleAddBrowser = async (browserName) => {
    try {
      const res = await fetch('http://localhost:4000/api/browsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browser_name: browserName }),
      });
      if (res.ok) {
        const newBrowser = await res.json();
        setBrowserOptions([...browserOptions, newBrowser.browser_name]);
      }
    } catch (err) {
      console.error('Error adding browser:', err);
    }
  };

  const handleDeleteBrowser = async (browserName) => {
    try {
      const res = await fetch(`http://localhost:4000/api/browsers/${encodeURIComponent(browserName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBrowserOptions(browserOptions.filter(b => b !== browserName));
      }
    } catch (err) {
      console.error('Error deleting browser:', err);
    }
  };

  const handleAddEnvironment = async (environmentName) => {
    try {
      const res = await fetch('http://localhost:4000/api/environments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment_name: environmentName }),
      });
      if (res.ok) {
        const newEnvironment = await res.json();
        setEnvironmentOptions([...environmentOptions, newEnvironment.environment_name]);
      }
    } catch (err) {
      console.error('Error adding environment:', err);
    }
  };

  const handleDeleteEnvironment = async (environmentName) => {
    try {
      const res = await fetch(`http://localhost:4000/api/environments/${encodeURIComponent(environmentName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnvironmentOptions(environmentOptions.filter(e => e !== environmentName));
      }
    } catch (err) {
      console.error('Error deleting environment:', err);
    }
  };

  const handleAddTestType = async (testTypeName) => {
    try {
      const res = await fetch('http://localhost:4000/api/test-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_type_name: testTypeName }),
      });
      if (res.ok) {
        const newTestType = await res.json();
        setTestTypeOptions([...testTypeOptions, newTestType.test_type_name]);
      }
    } catch (err) {
      console.error('Error adding test type:', err);
    }
  };

  const handleDeleteTestType = async (testTypeName) => {
    try {
      const res = await fetch(`http://localhost:4000/api/test-types/${encodeURIComponent(testTypeName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTestTypeOptions(testTypeOptions.filter(t => t !== testTypeName));
      }
    } catch (err) {
      console.error('Error deleting test type:', err);
    }
  };

  const handleAddTestCase = (description) => {
    const newTestCase = {
      id: uuidv4(),
      description,
    };
    setTestCases([...testCases, newTestCase]);
    return true; // Indicate success for toast
  };

  const handleEditTestCase = (id, description) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, description } : tc));
  };

  const handleDeleteTestCase = (id) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const handleCopyTestCase = (testCase) => {
    const newTestCase = {
      id: uuidv4(),
      description: testCase.description,
    };
    setTestCases([...testCases, newTestCase]);
  };

  const handleReorderTestCases = (result) => {
    if (!result.destination) return;
    const reorderedTestCases = Array.from(testCases);
    const [movedTestCase] = reorderedTestCases.splice(result.source.index, 1);
    reorderedTestCases.splice(result.destination.index, 0, movedTestCase);
    setTestCases(reorderedTestCases);
  };

  const handleAddTestResult = (testResult) => {
    const newTestResult = {
      id: uuidv4(),
      ...testResult,
    };
    setTestResults([...testResults, newTestResult]);
    return true; // Indicate success for toast
  };

  const handleDeleteTestResult = (id) => {
    setTestResults(testResults.filter(tr => tr.id !== id));
  };

  const handleAddIssue = (issue) => {
    const newIssue = {
      id: uuidv4(),
      ...issue,
    };
    setIssues([...issues, newIssue]);
    return true; // Indicate success for toast
  };

  const handleDeleteIssue = (id) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const handleDownloadPDF = () => {
    if (dateError) {
      alert(dateError);
      return;
    }
    if (!startDate || !endDate) {
      alert('Start Date and End Date are required.');
      return;
    }

    const doc = new jsPDF();
    let yOffset = 20;
    let pageNumber = 1;
    const pageNumbers = {
      toc: 2,
      summary: 3,
      testCases: 3,
      testResults: 3,
      issues: 3,
      notes: 3,
      recommendations: 3,
      conclusion: 3,
    };

    // Add Header
    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 115, 0); // #ff7300
      doc.text('Caparizon Software Pvt. Ltd.', 20, 10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(0, 0, 0);
      doc.line(20, 12, 190, 12);
    };

    // Add Footer
    const addFooter = (currentPage, totalPages) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`Page ${currentPage} of ${totalPages}`, 190, 290, { align: 'right' });
    };

    // Page 1: Cover Page
    doc.setFillColor(230, 243, 243); // #E6F3F3
    doc.rect(20, 100, 170, 80, 'F');
    try {
      doc.addImage(logoImage, 'PNG', 85, 60, 40, 20); // Add logo
    } catch (err) {
      console.error('Error adding logo:', err);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('[Logo Error]', 105, 80, { align: 'center' });
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 115, 0); // #ff7300
    doc.text('CAPARIZON', 105, 130, { align: 'center' });
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('TEST REPORT', 105, 150, { align: 'center' });
    doc.setFontSize(16);
    doc.text(projectName || 'Project Name', 105, 170, { align: 'center' });
    if (version) {
      doc.setFontSize(12);
      doc.text(`Version: ${version}`, 105, 180, { align: 'center' });
    }
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    const leftX = 150;
    const bottomStartY = 220;
    doc.setTextColor(255, 115, 0); // #ff7300
    doc.text('Caparizon Software Pvt. Ltd.', leftX, bottomStartY, { align: 'left' });
    doc.setFont('times', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('D-75, 8th Floor, Infra Futura,', leftX, bottomStartY + 5, { align: 'left' });
    doc.text('Kakkanad, Kochi – 682021', leftX, bottomStartY + 10, { align: 'left' });
    doc.text('Kerala, India', leftX, bottomStartY + 15, { align: 'left' });
    doc.setFont('times', 'bold');
    doc.setTextColor(255, 115, 0); // #ff7300
    doc.text('Head Quarters', leftX, bottomStartY + 25, { align: 'left' });
    doc.setFont('times', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('ITFlux Inc,', leftX, bottomStartY + 30, { align: 'left' });
    doc.text('135 Camino Dorado,', leftX, bottomStartY + 35, { align: 'left' });
    doc.text('Suite 12A, Napa, CA 94558', leftX, bottomStartY + 40, { align: 'left' });
    doc.text('Phone: (408)-649-5642', leftX, bottomStartY + 45, { align: 'left' });
    doc.setTextColor(0, 0, 128); // #000080
    doc.textWithLink('Email: info@caparizon.com', leftX, bottomStartY + 50, { align: 'left', url: 'mailto:info@caparizon.com' });
    doc.textWithLink('Website: www.caparizon.com', leftX, bottomStartY + 55, { align: 'left', url: 'https://www.caparizon.com' });
    addHeader();
    addFooter(pageNumber, 1); // Placeholder
    doc.addPage();
    pageNumber++;

    // Page 2: Table of Contents
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Table of Contents', 105, yOffset, { align: 'center' });
    const tocWidth = doc.getTextWidth('Table of Contents');
    doc.setDrawColor(0, 0, 0);
    doc.line(105 - tocWidth / 2, yOffset + 2, 105 + tocWidth / 2, yOffset + 2);
    yOffset += 20;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    addHeader();
    addFooter(pageNumber, 1); // Placeholder
    doc.addPage();
    pageNumber++;

    // Page 3+: Test Report
    yOffset = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Test Report', 105, yOffset, { align: 'center' });
    const testReportWidth = doc.getTextWidth('Test Report');
    doc.setDrawColor(0, 0, 0);
    doc.line(105 - testReportWidth / 2, yOffset + 2, 105 + testReportWidth / 2, yOffset + 2);
    yOffset += 20;

    // Project Details Table
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.autoTable({
      startY: yOffset,
      head: [['Field', 'Value']],
      body: [
        ['Type of Test', testType || 'Regression- Manual'],
        ['Change ID', changeId || 'I814190d8bc94f1b54adf83719bd87fa13f'],
        ['Browser', browser || 'Version 129.0.6668.90 (Official Build) (64-bit)'],
        ['Environment', environment || 'TEST /DEV/UAT/LIVE'],
        ['Start Date', startDate ? startDate.toLocaleDateString('en-GB') : '26/03/2025'],
        ['End Date', endDate ? endDate.toLocaleDateString('en-GB') : '26/03/2025'],
        ['Tester', tester || 'Nandhu Krishna A'],
        ['Status', status || 'Pass'],
      ],
      styles: {
        font: 'times',
        fontSize: 10,
        cellPadding: 3,
        lineColor: [51, 51, 51],
        lineWidth: 0.2,
        textColor: [0, 0, 0],
      },
      headStyles: { fillColor: [154, 202, 219], textColor: [0, 0, 0], fontStyle: 'bold' }, // #9acadb
      alternateRowStyles: { fillColor: [245, 246, 245] }, // #F5F6F5
      columnStyles: { 0: { fontStyle: 'bold' } },
      didParseCell: (data) => {
        if (data.column.index === 1 && data.section === 'body' && data.row.index === 7) {
          const status = data.cell.text[0];
          if (status === 'Pass') {
            data.cell.styles.textColor = [5, 237, 5]; // #05ed05
          } else if (status === 'Fail') {
            data.cell.styles.textColor = [255, 49, 31]; // #ff311f
          } else if (status === 'Blocked') {
            data.cell.styles.textColor = [0, 0, 255]; // #0000FF
          }
        }
      },
      didDrawPage: () => {
        addHeader();
        addFooter(pageNumber, 1); // Placeholder
        pageNumber++;
      },
    });
    yOffset = doc.lastAutoTable.finalY + 20;
    pageNumbers.summary = pageNumber - 1;

    // Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Summary', 20, yOffset);
    const summaryWidth = doc.getTextWidth('Summary');
    doc.line(20, yOffset + 2, 20 + summaryWidth, yOffset + 2);
    yOffset += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(summary || 'No summary provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(summary || 'No summary provided.', { maxWidth: 170 }).h + 20;
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.testCases = pageNumber;

    // Test Cases
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Test Cases', 20, yOffset);
    const testCasesWidth = doc.getTextWidth('Test Cases');
    doc.line(20, yOffset + 2, 20 + testCasesWidth, yOffset + 2);
    yOffset += 10;
    if (testCases.length > 0) {
      doc.autoTable({
        startY: yOffset,
        head: [['No', 'Description']],
        body: testCases.map((tc, index) => [index + 1, tc.description || 'N/A']),
        styles: {
          font: 'times',
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0],
        },
        headStyles: { fillColor: [154, 202, 219], textColor: [0, 0, 0], fontStyle: 'bold' }, // #9acadb
        alternateRowStyles: { fillColor: [245, 245, 245] }, // #F5F5F5
        bodyStyles: { fillColor: [255, 255, 255] }, // #FFFFFF
        didDrawCell: (data) => {
          if (data.section === 'body') {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        },
        didDrawPage: () => {
          addHeader();
          addFooter(pageNumber, 1); // Placeholder
          pageNumber++;
        },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.text('No test cases found.', 20, yOffset);
      yOffset += 20;
    }
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.testResults = pageNumber;

    // Test Results
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Test Results', 20, yOffset);
    const testResultsWidth = doc.getTextWidth('Test Results');
    doc.line(20, yOffset + 2, 20 + testResultsWidth, yOffset + 2);
    yOffset += 10;
    if (testResults.length > 0) {
      doc.autoTable({
        startY: yOffset,
        head: [['No', 'Ticket ID', 'Type', 'Status', 'Priority']],
        body: testResults.map((tr, index) => [
          index + 1,
          tr.ticketId || 'N/A',
          tr.type || 'N/A',
          tr.status || 'N/A',
          tr.priority || 'N/A',
        ]),
        styles: {
          font: 'times',
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0],
        },
        headStyles: { fillColor: [154, 202, 219], textColor: [0, 0, 0], fontStyle: 'bold' }, // #9acadb
        alternateRowStyles: { fillColor: [245, 245, 245] }, // #F5F5F5
        bodyStyles: { fillColor: [255, 255, 255] }, // #FFFFFF
        didParseCell: (data) => {
          if (data.column.index === 3 && data.section === 'body') {
            const status = data.cell.text[0];
            if (status === 'Pass') {
              data.cell.styles.textColor = [5, 237, 5]; // #05ed05
            } else if (status === 'Fail') {
              data.cell.styles.textColor = [255, 49, 31]; // #ff311f
            } else if (status === 'Blocked') {
              data.cell.styles.textColor = [0, 0, 255]; // #0000FF
            }
          }
          if (data.column.index === 4 && data.section === 'body') {
            const priority = data.cell.text[0];
            if (priority === 'High') {
              data.cell.styles.textColor = [255, 49, 31]; // #ff311f
            } else if (priority === 'Medium') {
              data.cell.styles.textColor = [252, 186, 5]; // #fcba05
            } else if (priority === 'Low') {
              data.cell.styles.textColor = [5, 237, 5]; // #05ed05
            }
          }
        },
        didDrawCell: (data) => {
          if (data.section === 'body') {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        },
        didDrawPage: () => {
          addHeader();
          addFooter(pageNumber, 1); // Placeholder
          pageNumber++;
        },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.text('No test results found.', 20, yOffset);
      yOffset += 20;
    }
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.issues = pageNumber;

    // Issues Identified
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 49, 31); // #ff311f
    doc.text('Issues Identified', 20, yOffset);
    const issuesWidth = doc.getTextWidth('Issues Identified');
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yOffset + 2, 20 + issuesWidth, yOffset + 2);
    doc.setTextColor(0, 0, 0);
    yOffset += 10;
    if (issues.length > 0) {
      doc.autoTable({
        startY: yOffset,
        head: [['No', 'Ticket', 'Description', 'Priority']],
        body: issues.map((issue, index) => [
          index + 1,
          issue.ticket || 'N/A',
          issue.description || 'N/A',
          issue.priority || 'N/A',
        ]),
        styles: {
          font: 'times',
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0],
        },
        headStyles: { fillColor: [154, 202, 219], textColor: [0, 0, 0], fontStyle: 'bold' }, // #9acadb
        alternateRowStyles: { fillColor: [245, 245, 245] }, // #F5F5F5
        bodyStyles: { fillColor: [255, 255, 255] }, // #FFFFFF
        didParseCell: (data) => {
          if (data.column.index === 3 && data.section === 'body') {
            const priority = data.cell.text[0];
            if (priority === 'High') {
              data.cell.styles.textColor = [255, 49, 31]; // #ff311f
            } else if (priority === 'Medium') {
              data.cell.styles.textColor = [252, 186, 5]; // #fcba05
            } else if (priority === 'Low') {
              data.cell.styles.textColor = [5, 237, 5]; // #05ed05
            }
          }
        },
        didDrawCell: (data) => {
          if (data.section === 'body') {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        },
        didDrawPage: () => {
          addHeader();
          addFooter(pageNumber, 1); // Placeholder
          pageNumber++;
        },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.text('No issues provided.', 20, yOffset);
      yOffset += 20;
    }
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.notes = pageNumber;

    // Notes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Notes', 20, yOffset);
    const notesWidth = doc.getTextWidth('Notes');
    doc.line(20, yOffset + 2, 20 + notesWidth, yOffset + 2);
    yOffset += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(notes || 'No notes provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(notes || 'No notes provided.', { maxWidth: 170 }).h + 20;
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.recommendations = pageNumber;

    // Recommendations
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Recommendations', 20, yOffset);
    const recommendationsWidth = doc.getTextWidth('Recommendations');
    doc.line(20, yOffset + 2, 20 + recommendationsWidth, yOffset + 2);
    yOffset += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(recommendations || 'No recommendations provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(recommendations || 'No recommendations provided.', { maxWidth: 170 }).h + 20;
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
      pageNumber++;
    }
    pageNumbers.conclusion = pageNumber;

    // Conclusion
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Conclusion', 20, yOffset);
    const conclusionWidth = doc.getTextWidth('Conclusion');
    doc.line(20, yOffset + 2, 20 + conclusionWidth, yOffset + 2);
    yOffset += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(conclusion || 'No conclusion provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(conclusion || 'No conclusion provided.', { maxWidth: 170 }).h + 20;
    if (yOffset > 250) {
      doc.addPage();
      pageNumber++;
    }

    // Update Table of Contents
    doc.setPage(2);
    yOffset = 40;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    const tocItems = [
      { name: 'Summary', page: pageNumbers.summary },
      { name: 'Test Cases', page: pageNumbers.testCases },
      { name: 'Test Results', page: pageNumbers.testResults },
      { name: 'Issues Identified', page: pageNumbers.issues },
      { name: 'Notes', page: pageNumbers.notes },
      { name: 'Recommendations', page: pageNumbers.recommendations },
      { name: 'Conclusion', page: pageNumbers.conclusion },
    ];
    const tocLeftX = 20;
    const tocRightX = 190;
    tocItems.forEach((item) => {
      const nameWidth = doc.getTextWidth(item.name);
      const pageWidth = doc.getTextWidth(item.page.toString());
      const availableWidth = tocRightX - tocLeftX - nameWidth - pageWidth;
      const dotWidth = doc.getTextWidth('.');
      const dotsNeeded = Math.floor(availableWidth / dotWidth);
      const dots = '.'.repeat(dotsNeeded);
      doc.text(`${item.name}${dots}`, tocLeftX, yOffset);
      doc.text(item.page.toString(), tocRightX, yOffset, { align: 'right' });
      yOffset += 10;
    });

    // Update footers
    const totalPages = pageNumber - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(255, 255, 255);
      doc.rect(170, 285, 30, 10, 'F');
      addFooter(i, totalPages);
    }

    // Save PDF
    doc.save(`${projectName || 'QA_Test_Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleUploadPDF = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');

      // Extract project name and version
      const projectNameMatch = text.match(/TEST REPORT\s+(.+?)(?:\s+Version:|$)/i);
      const versionMatch = text.match(/Version:\s+(.+)/i);
      if (projectNameMatch && projectNameMatch[1]) {
        setProjectName(projectNameMatch[1].trim());
      }
      if (versionMatch && versionMatch[1]) {
        setVersion(versionMatch[1].trim());
      }

      // Process additional pages
      for (let i = 2; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');

        // Extract fields
        const testTypeMatch = pageText.match(/Type of Test\s+(.+?)(?=\s+Change ID|$)/i);
        const changeIdMatch = pageText.match(/Change ID\s+(.+?)(?=\s+Browser|$)/i);
        const browserMatch = pageText.match(/Browser\s+(.+?)(?=\s+Environment|$)/i);
        const environmentMatch = pageText.match(/Environment\s+(.+?)(?=\s+Start Date|$)/i);
        const startDateMatch = pageText.match(/Start Date\s+(.+?)(?=\s+End Date|$)/i);
        const endDateMatch = pageText.match(/End Date\s+(.+?)(?=\s+Tester|$)/i);
        const testerMatch = pageText.match(/Tester\s+(.+?)(?=\s+Status|$)/i);
        const statusMatch = pageText.match(/Status\s+(.+)/i);

        if (testTypeMatch) setTestType(testTypeMatch[1].trim());
        if (changeIdMatch) setChangeId(changeIdMatch[1].trim());
        if (browserMatch) setBrowser(browserMatch[1].trim());
        if (environmentMatch) setEnvironment(environmentMatch[1].trim());
        if (startDateMatch) {
          const [day, month, year] = startDateMatch[1].trim().split('/');
          const newStartDate = new Date(`${year}-${month}-${day}`);
          setStartDate(newStartDate);
        }
        if (endDateMatch) {
          const [day, month, year] = endDateMatch[1].trim().split('/');
          const newEndDate = new Date(`${year}-${month}-${day}`);
          if (!startDate || newEndDate >= startDate) {
            setEndDate(newEndDate);
            setDateError('');
          } else {
            setDateError('End Date in uploaded PDF is earlier than Start Date.');
            setEndDate(null);
          }
        }
        if (testerMatch) setTester(testerMatch[1].trim());
        if (statusMatch) setStatus(statusMatch[1].trim());

        // Extract sections
        const summaryMatch = pageText.match(/Summary\s+(.+?)(?=\s+Test Cases|$)/i);
        const testCasesMatch = pageText.match(/Test Cases\s+(.+?)(?=\s+Test Results|$)/i);
        const testResultsMatch = pageText.match(/Test Results\s+(.+?)(?=\s+Issues Identified|$)/i);
        const issuesMatch = pageText.match(/Issues Identified\s+(.+?)(?=\s+Notes|$)/i);
        const notesMatch = pageText.match(/Notes\s+(.+?)(?=\s+Recommendations|$)/i);
        const recommendationsMatch = pageText.match(/Recommendations\s+(.+?)(?=\s+Conclusion|$)/i);
        const conclusionMatch = pageText.match(/Conclusion\s+(.+)/i);

        if (summaryMatch) setSummary(summaryMatch[1].trim());
        if (notesMatch) setNotes(notesMatch[1].trim());
        if (recommendationsMatch) setRecommendations(recommendationsMatch[1].trim());
        if (conclusionMatch) setConclusion(conclusionMatch[1].trim());

        // Parse test cases
        if (testCasesMatch) {
          const testCasesText = testCasesMatch[1].trim();
          const testCaseLines = testCasesText.split(/\d+\.\s+/).filter(line => line.trim());
          const newTestCases = testCaseLines.map(description => ({
            id: uuidv4(),
            description: description.trim(),
          }));
          setTestCases(newTestCases);
        }

        // Parse test results
        if (testResultsMatch) {
          const testResultsText = testResultsMatch[1].trim();
          const testResultLines = testResultsText.split(/\d+\.\s+/).filter(line => line.trim());
          const newTestResults = testResultLines.map(line => {
            const [ticketId, type, status, priority] = line.split(/\s+/).filter(Boolean);
            return {
              id: uuidv4(),
              ticketId: ticketId || '',
              type: type || '',
              status: status || '',
              priority: priority || '',
            };
          });
          setTestResults(newTestResults);
        }

        // Parse issues
        if (issuesMatch) {
          const issuesText = issuesMatch[1].trim();
          const issueLines = issuesText.split(/\d+\.\s+/).filter(line => line.trim());
          const newIssues = issueLines.map(line => {
            const [ticket, ...rest] = line.split(/\s+/).filter(Boolean);
            const priority = rest.pop();
            const description = rest.join(' ');
            return {
              id: uuidv4(),
              ticket: ticket || '',
              description: description || '',
              priority: priority || '',
            };
          });
          setIssues(newIssues);
        }
      }
    } catch (err) {
      console.error('Error processing PDF:', err);
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
    environmentOptions,
    testTypeOptions,
    browserOptions,
    testResultTypes,
    testResultStatuses,
    testResultPriorities,
    projects,
    refreshSettingsData,
    handleAddProject,
    handleDeleteProject,
    handleAddBrowser,
    handleDeleteBrowser,
    handleAddEnvironment,
    handleDeleteEnvironment,
    handleAddTestType,
    handleDeleteTestType,
    dateError,
  };
};

export default useQATestReportFunctionality;