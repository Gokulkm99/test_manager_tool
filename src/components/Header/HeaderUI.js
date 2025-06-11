import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '../logo.png';
import { CogIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const HeaderUI = ({
  user,
  currentTime,
  isProfileOpen,
  isTimeZoneOpen,
  toastMessage,
  profileRef,
  timeRef,
  calendarMonth,
  calendarYear,
  handleLogout,
  toggleProfile,
  toggleTimeZone,
  handleAchieve,
  handleUserManager,
  handleHome,
  handleSettings,
  handleLogoClick,
  handlePrevMonth,
  handleNextMonth,
  handleYearChange,
}) => {
  const formatDateTime = (date, timeZone = 'Asia/Kolkata') => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone,
    });
  };

  const renderCalendar = () => {
    console.log('Rendering calendar:', { calendarMonth, calendarYear });
    // Validate inputs
    if (!Number.isFinite(calendarMonth) || calendarMonth < 0 || calendarMonth > 11) {
      console.log('Invalid month:', calendarMonth);
      return <div>Invalid Month</div>;
    }
    if (!Number.isFinite(calendarYear)) {
      console.log('Invalid year:', calendarYear);
      return <div>Invalid Year</div>;
    }

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    let lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    console.log('Calendar calculations:', { firstDay, lastDay });

    // Fallback if lastDay is invalid
    if (!Number.isFinite(lastDay) || lastDay < 28 || lastDay > 31) {
      console.log('Invalid lastDay, using fallback:', lastDay);
      lastDay = 30;
    }

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    for (let day = 1; day <= lastDay; day++) {
      console.log('Rendering day:', day);
      const isToday =
        day === currentTime.getDate() &&
        calendarMonth === currentTime.getMonth() &&
        calendarYear === currentTime.getFullYear();
      days.push(
        <div
          key={`day-${day}`}
          className={`p-1 text-center ${isToday ? 'bg-blue-600 text-white rounded-full' : 'text-gray-200'}`}
        >
          {day}
        </div>
      );
    }
    console.log('Rendered days:', days.length);

    const monthName = new Date(calendarYear, calendarMonth).toLocaleString('en-US', { month: 'long' });

    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <button
            onClick={handlePrevMonth}
            className="bg-blue-600 text-white px-1 py-0.5 rounded hover:bg-blue-700 text-xs"
          >
            &lt;
          </button>
          <div className="flex items-center space-x-1">
            <h4 className="text-xs font-medium">{monthName}</h4>
            <input
              type="number"
              value={calendarYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="bg-gray-700 text-gray-200 text-xs rounded w-16"
              placeholder="Year"
            />
          </div>
          <button
            onClick={handleNextMonth}
            className="bg-blue-600 text-white px-1 py-0.5 rounded hover:bg-blue-700 text-xs"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold text-gray-300">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <motion.header
      className="relative text-gray-200 p-2 shadow-md bg-gradient-to-b from-gray-900 to-gray-800 w-full"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-container relative overflow-hidden">
        <div className="stars"></div>
        <div className="shooting-star top-[10%]"></div>
        <div className="shooting-star top-[30%] delay-1000"></div>
        <div className="shooting-star top-[50%] delay-2000"></div>
      </div>

      <div className="w-full flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <motion.img
            src={logoImage}
            alt="Caparizon Logo"
            className="w-12 h-8 cursor-pointer"
            onClick={handleLogoClick}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-300">Welcome, {user.username}</span>

            <button
              onClick={handleHome}
              className="relative px-2 py-1 bg-gray-800 text-gray-200 text-xs font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              HOME
              <span className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 glow-effect"></span>
            </button>

            <button
              onClick={handleUserManager}
              className="relative px-2 py-1 bg-gray-800 text-gray-200 text-xs font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              USER MANAGER
              <span className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 glow-effect"></span>
            </button>

            <button
              onClick={handleAchieve}
              className="relative px-2 py-1 bg-gray-800 text-gray-200 text-xs font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              ACHIEVE
              <span className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 glow-effect"></span>
            </button>

            <button
              onClick={handleSettings}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <CogIcon className="h-5 w-5 text-gray-300" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-300" />
              </button>
              {isProfileOpen && (
                <motion.div
                  className="absolute top-full right-0 mt-1 w-40 bg-gray-800 text-gray-200 rounded-md shadow-lg p-2 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs font-medium">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.designation || 'User'}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-1 w-full py-0.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            <div className="relative" ref={timeRef}>
              <span
                className="text-xs text-gray-300 cursor-pointer"
                onClick={toggleTimeZone}
              >
                {formatDateTime(currentTime)}
              </span>
              {isTimeZoneOpen && (
                <motion.div
                  className="absolute top-full right-0 mt-1 w-64 bg-gray-800 text-gray-200 rounded-md shadow-lg p-2 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-xs font-medium mb-1">Calendar</h4>
                  {renderCalendar()}
                  <h4 className="text-xs font-medium mt-2 mb-1">Time Zones</h4>
                  <p className="text-xs">
                    Chicago: {formatDateTime(currentTime, 'America/Chicago')}
                  </p>
                  <p className="text-xs">
                    Japan: {formatDateTime(currentTime, 'Asia/Tokyo')}
                  </p>
                  <p className="text-xs">
                    India: {formatDateTime(currentTime, 'Asia/Kolkata')}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {toastMessage && (
          <motion.div
            className="fixed bottom-4 right-4 bg-red-600 text-white px-2 py-1 rounded-md shadow-lg max-w-xs z-60"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default HeaderUI;