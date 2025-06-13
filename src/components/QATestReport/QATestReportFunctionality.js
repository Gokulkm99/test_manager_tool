import { useState, useEffect, useContext } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as pdfjsLib from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../AuthContext';

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
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [projects, setProjects] = useState([]);
  const [browserOptions, setBrowserOptions] = useState([]);
  const [environmentOptions, setEnvironmentOptions] = useState([]);
  const [testTypeOptions, setTestTypeOptions] = useState([]);
  const [testResultTypes] = useState(['Functional', 'Regression', 'Integration', 'Smoke']);
  const [testResultStatuses] = useState(['Pass', 'Fail', 'Blocked']);
  const [testResultPriorities] = useState(['High', 'Medium', 'Low']);

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
        // Fetch projects
        const projectsRes = await fetch('http://localhost:4000/api/projects');
        const projectsData = await projectsRes.json();
        console.log('Projects API response:', projectsData);
        if (typeof projectsData === 'object' && projectsData !== null) {
          setProjects(Object.keys(projectsData));
        } else {
          console.error('Projects data is not an object:', projectsData);
          setProjects([]);
        }

        // Fetch browsers
        const browsersRes = await fetch('http://localhost:4000/api/browsers');
        const browsersData = await browsersRes.json();
        console.log('Browsers API response:', browsersData);
        if (Array.isArray(browsersData)) {
          setBrowserOptions(browsersData);
        } else {
          console.error('Browsers data is not an array:', browsersData);
          setBrowserOptions([]);
        }

        // Fetch environments
        const environmentsRes = await fetch('http://localhost:4000/api/environments');
        const environmentsData = await environmentsRes.json();
        console.log('Environments API response:', environmentsData);
        if (Array.isArray(environmentsData)) {
          setEnvironmentOptions(environmentsData);
        } else {
          console.error('Environments data is not an array:', environmentsData);
          setEnvironmentOptions([]);
        }

        // Fetch test types
        const testTypesRes = await fetch('http://localhost:4000/api/test-types');
        const testTypesData = await testTypesRes.json();
        console.log('Test Types API response:', testTypesData);
        if (Array.isArray(testTypesData)) {
          setTestTypeOptions(testTypesData);
        } else {
          console.error('Test Types data is not an array:', testTypesData);
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
      setSummary((prev) => prev.replace(/{{Project Name}}/g, projectName));
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
  };

  const handleDeleteIssue = (id) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Cover Page
    doc.setFontSize(40);
    doc.text('QA Test Report', 105, 100, { align: 'center' });
    doc.setFontSize(20);
    doc.text(projectName || 'N/A', 105, 120, { align: 'center' });
    doc.addPage();

    // Project Details
    doc.setFontSize(16);
    doc.text('Project Details', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Project Name: ${projectName || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Version: ${version || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Tester: ${tester || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Environment: ${environment || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Start Date: ${startDate ? startDate.toLocaleDateString() : 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`End Date: ${endDate ? endDate.toLocaleDateString() : 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Test Type: ${testType || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Change ID: ${changeId || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Browser: ${browser || 'N/A'}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Status: ${status || 'N/A'}`, 20, yOffset);
    yOffset += 20;

    // Summary
    doc.setFontSize(16);
    doc.text('Summary', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(summary || 'No summary provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(summary || 'No summary provided.', { maxWidth: 170 }).h + 10;

    // Test Cases
    doc.setFontSize(16);
    doc.text('Test Cases', 20, yOffset);
    yOffset += 10;
    if (testCases.length > 0) {
      doc.autoTable({
        startY: yOffset,
        head: [['No', 'Description']],
        body: testCases.map((tc, index) => [index + 1, tc.description || 'N/A']),
        styles: { fontSize: 10 },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.text('No test cases provided.', 20, yOffset);
      yOffset += 20;
    }

    // Test Results
    doc.setFontSize(16);
    doc.text('Test Results', 20, yOffset);
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
        styles: { fontSize: 10 },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.text('No test results provided.', 20, yOffset);
      yOffset += 20;
    }

    // Issues
    doc.setFontSize(16);
    doc.text('Issues Identified', 20, yOffset);
    yOffset += 10;
    if (issues.length > 0) {
      doc.autoTable({
        startY: yOffset,
        head: [['No', 'Ticket', 'Description']],
        body: issues.map((issue, index) => [
          index + 1,
          issue.ticket || 'N/A',
          issue.description || 'N/A',
        ]),
        styles: { fontSize: 10 },
      });
      yOffset = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.text('No issues provided.', 20, yOffset);
      yOffset += 20;
    }

    // Notes
    doc.setFontSize(16);
    doc.text('Notes', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(notes || 'No notes provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(notes || 'No notes provided.', { maxWidth: 170 }).h + 10;

    // Recommendations
    doc.setFontSize(16);
    doc.text('Recommendations', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(recommendations || 'No recommendations provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(recommendations || 'No recommendations provided.', { maxWidth: 170 }).h + 10;

    // Conclusion
    doc.setFontSize(16);
    doc.text('Conclusion', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(conclusion || 'No conclusion provided.', 20, yOffset, { maxWidth: 170 });
    yOffset += doc.getTextDimensions(conclusion || 'No conclusion provided.', { maxWidth: 170 }).h + 10;
    doc.text(`The Testing has been completed and it is ${status || 'N/A'}.`, 20, yOffset);

    doc.save(`${projectName || 'QA_Test_Report'}.pdf`);
  };

  const handleUploadPDF = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(' ') + '\n';
      }

      const lines = textContent.split('\n');
      let newProjectName = '';
      let newTester = tester;
      let newVersion = '';
      let newEnvironment = '';
      let newStartDate = '';
      let newEndDate = '';
      let newTestType = '';
      let newChangeId = '';
      let newBrowser = '';
      let newStatus = '';
      let newSummary = '';
      let newTestCases = [];
      let newTestResults = [];
      let newIssues = [];
      let newNotes = '';
      let newRecommendations = '';
      let newConclusion = '';

      let currentSection = '';

      lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('Project Name:')) {
          newProjectName = line.replace('Project Name:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Version:')) {
          newVersion = line.replace('Version:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Tester:')) {
          newTester = line.replace('Tester:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Environment:')) {
          newEnvironment = line.replace('Environment:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Start Date:')) {
          newStartDate = line.replace('Start Date:', '').trim();
          currentSection = '';
        } else if (line.startsWith('End Date:')) {
          newEndDate = line.replace('End Date:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Test Type:')) {
          newTestType = line.replace('Test Type:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Change ID:')) {
          newChangeId = line.replace('Change ID:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Browser:')) {
          newBrowser = line.replace('Browser:', '').trim();
          currentSection = '';
        } else if (line.startsWith('Status:')) {
          newStatus = line.replace('Status:', '').trim();
          currentSection = '';
        } else if (line === 'Summary') {
          currentSection = 'summary';
          newSummary = '';
        } else if (line === 'Test Cases') {
          currentSection = 'testCases';
          newTestCases = [];
        } else if (line === 'Test Results') {
          currentSection = 'testResults';
          newTestResults = [];
        } else if (line === 'Issues Identified') {
          currentSection = 'issues';
          newIssues = [];
        } else if (line === 'Notes') {
          currentSection = 'notes';
          newNotes = '';
        } else if (line === 'Recommendations') {
          currentSection = 'recommendations';
          newRecommendations = '';
        } else if (line === 'Conclusion') {
          currentSection = 'conclusion';
          newConclusion = '';
        } else if (currentSection === 'summary' && line) {
          newSummary += line + ' ';
        } else if (currentSection === 'notes' && line) {
          newNotes += line + ' ';
        } else if (currentSection === 'recommendations' && line) {
          newRecommendations += line + ' ';
        } else if (currentSection === 'conclusion' && line && !line.includes('The Testing has been completed')) {
          newConclusion += line + ' ';
        } else if (currentSection === 'testCases' && line && !line.includes('No ') && !line.includes('Description')) {
          const parts = line.split(/\s{2,}/);
          if (parts.length >= 2) {
            const description = parts[1];
            newTestCases.push({ id: uuidv4(), description });
          }
        } else if (currentSection === 'testResults' && line && !line.includes('No ') && !line.includes('Ticket ID')) {
          const parts = line.split(/\s{2,}/);
          if (parts.length >= 5) {
            const ticketId = parts[1];
            const type = parts[2];
            const status = parts[3];
            const priority = parts[4];
            newTestResults.push({ id: uuidv4(), ticketId, type, status, priority });
          }
        } else if (currentSection === 'issues' && line && !line.includes('No ') && !line.includes('Ticket')) {
          const parts = line.split(/\s{2,}/);
          if (parts.length >= 3) {
            const ticket = parts[1];
            const description = parts.slice(2).join(' ');
            newIssues.push({ id: uuidv4(), ticket, description });
          }
        }
      });

      setProjectName(newProjectName);
      setVersion(newVersion);
      setTester(newTester);
      setEnvironment(newEnvironment);
      setStartDate(newStartDate ? new Date(newStartDate) : null);
      setEndDate(newEndDate ? new Date(newEndDate) : null);
      setTestType(newTestType);
      setChangeId(newChangeId);
      setBrowser(newBrowser);
      setStatus(newStatus || '');
      setSummary(newSummary.trim());
      setTestCases(newTestCases);
      setTestResults(newTestResults);
      setIssues(newIssues);
      setNotes(newNotes.trim());
      setRecommendations(newRecommendations.trim());
      setConclusion(newConclusion.trim());
    } catch (err) {
      console.error('Error processing PDF:', err);
      alert('Failed to process the PDF file.');
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
    projects,
    browserOptions,
    environmentOptions,
    testTypeOptions,
    handleAddProject,
    handleDeleteProject,
    handleAddBrowser,
    handleDeleteBrowser,
    handleAddEnvironment,
    handleDeleteEnvironment,
    handleAddTestType,
    handleDeleteTestType,
    testResultTypes,
    testResultStatuses,
    testResultPriorities,
    refreshSettingsData,
  };
};

export default useQATestReportFunctionality;