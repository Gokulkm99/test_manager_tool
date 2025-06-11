import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import HeaderUI from './HeaderUI';

const HeaderFunctionality = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const timeoutRef = useRef(null);
  const profileRef = useRef(null);
  const timeRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  // Debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => func(...args), delay);
    };
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const dismissTimer = setTimeout(() => {
        setToastMessage('');
      }, 5000);
      return () => clearTimeout(dismissTimer);
    }
  }, [toastMessage]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        timeRef.current &&
        !timeRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
        setIsTimeZoneOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Reset calendar to current month/year when time dropdown opens
  useEffect(() => {
    if (isTimeZoneOpen) {
      const now = new Date();
      setCalendarMonth(now.getMonth());
      setCalendarYear(now.getFullYear());
      console.log('Calendar reset to:', { month: now.getMonth(), year: now.getFullYear() });
    }
  }, [isTimeZoneOpen]);

  const clearAchieveTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setShouldNavigate(false);
      setToastMessage('');
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    clearAchieveTimeout();
    logout();
    navigate('/login');
  };

  const toggleProfile = debounce((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Profile clicked, current isProfileOpen:', isProfileOpen);
    setIsProfileOpen((prev) => {
      console.log('Setting isProfileOpen to:', !prev);
      return !prev;
    });
    setIsTimeZoneOpen(false);
    clearAchieveTimeout();
  }, 200);

  const toggleTimeZone = debounce((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Time clicked, current isTimeZoneOpen:', isTimeZoneOpen);
    setIsTimeZoneOpen((prev) => {
      console.log('Setting isTimeZoneOpen to:', !prev);
      return !prev;
    });
    setIsProfileOpen(false);
    clearAchieveTimeout();
  }, 200);

  const handleAchieve = async () => {
    console.log('Achieve clicked');
    clearAchieveTimeout();
    setShouldNavigate(true);
    setToastMessage('');

    timeoutRef.current = setTimeout(() => {
      setToastMessage('Seems Achieve is responding very slow: please try again later');
      setShouldNavigate(false);
      timeoutRef.current = null;
    }, 20000);

    try {
      const controller = new AbortController();
      const response = await fetch(
        'http://agilescrummodel.com:3000/login?back_url=http%3A%2F%2Fagilescrummodel.com%3A3000%2Fmy%2Fpage',
        {
          method: 'HEAD',
          signal: controller.signal,
        }
      );

      clearAchieveTimeout();

      if (shouldNavigate && response.ok) {
        console.log('Navigating to Achieve URL');
        window.location.href =
          'http://agilescrummodel.com:3000/login?back_url=http%3A%2F%2Fagilescrummodel.com%3A3000%2Fmy%2Fpage';
      }
    } catch (error) {
      console.error('Navigation check failed:', error.message);
    }
  };

  const handleUserManager = () => {
    console.log('User Manager clicked');
    clearAchieveTimeout();
    navigate('/user-manager');
  };

  const handleHome = () => {
    console.log('Home clicked');
    clearAchieveTimeout();
    navigate('/');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    clearAchieveTimeout();
    navigate('/settings');
  };

  const handleLogoClick = () => {
    console.log('Logo clicked');
    clearAchieveTimeout();
    navigate('/');
  };

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 0) {
        setCalendarYear((y) => {
          const newYear = y - 1;
          console.log('Navigating to previous year:', newYear);
          return newYear;
        });
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 11) {
        setCalendarYear((y) => {
          const newYear = y + 1;
          console.log('Navigating to next year:', newYear);
          return newYear;
        });
        return 0;
      }
      return prev + 1;
    });
  };

  const handleYearChange = (year) => {
    const parsedYear = Number(year);
    if (Number.isFinite(parsedYear) && parsedYear >= -100000 && parsedYear <= 100000) {
      setCalendarYear(parsedYear);
      console.log('Year selected:', parsedYear);
    } else {
      console.log('Invalid year:', year);
    }
  };

  return (
    <HeaderUI
      user={user}
      currentTime={currentTime}
      isProfileOpen={isProfileOpen}
      isTimeZoneOpen={isTimeZoneOpen}
      toastMessage={toastMessage}
      profileRef={profileRef}
      timeRef={timeRef}
      calendarMonth={calendarMonth}
      calendarYear={calendarYear}
      handleLogout={handleLogout}
      toggleProfile={toggleProfile}
      toggleTimeZone={toggleTimeZone}
      handleAchieve={handleAchieve}
      handleUserManager={handleUserManager}
      handleHome={handleHome}
      handleSettings={handleSettings}
      handleLogoClick={handleLogoClick}
      handlePrevMonth={handlePrevMonth}
      handleNextMonth={handleNextMonth}
      handleYearChange={handleYearChange}
    />
  );
};

export default HeaderFunctionality;