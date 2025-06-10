import React from 'react';
import { Link } from 'react-router-dom';

const ButtonGroup = () => {
  return (
    <div className="flex justify-center gap-4 p-4">
      <Link to="/task-manager">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Task Manager
        </button>
      </Link>
      <Link to="/testcase-generator">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Testcase Generator
        </button>
      </Link>
      <Link to="/test-report-generator">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Test Report Generator
        </button>
      </Link>
      <Link to="/status-mail-formatter">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Status Mail Formatter
        </button>
      </Link>
      <Link to="/user-manager">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          User Manager
        </button>
      </Link>
    </div>
  );
};

export default ButtonGroup;