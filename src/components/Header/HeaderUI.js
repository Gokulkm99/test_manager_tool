import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../AuthContext';
import logoImage from '../logo.png';
import { CogIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const HeaderUI = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleUserManager = () => {
    navigate('/user-manager');
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  return (
    <motion.header
      className="relative text-gray-200 p-4 shadow-md bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Starry Background */}
      <div className="stars absolute inset-0"></div>
      <div className="shooting-star absolute w-[100px] h-[2px] bg-gradient-to-r from-gray-300 to-transparent top-[20%] left-[-100px] animate-shoot"></div>
      <div className="shooting-star absolute w-[100px] h-[2px] bg-gradient-to-r from-gray-300 to-transparent top-[35%] left-[-100px] animate-shoot delay-1000"></div>
      <div className="shooting-star absolute w-[100px] h-[2px] bg-gradient-to-r from-gray-300 to-transparent top-[50%] left-[-100px] animate-shoot delay-2000"></div>

      {/* Adjustment for logo left alignment: Removed mx-auto and added w-full to ensure container spans full width, allowing logo to sit at the left edge */}
      <div className="container w-full flex justify-between items-center relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-start">
          <motion.img
            src={logoImage}
            alt="Caparizon Logo"
            className="w-15 h-10"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            {/* User Manager Button */}
            <button
              onClick={handleUserManager}
              className="relative px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
            >
              USER MANAGER
              <span className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 glow-effect"></span>
            </button>

            {/* Settings Icon */}
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <CogIcon className="h-6 w-6 text-gray-300" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button onClick={toggleProfile} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <UserCircleIcon className="h-6 w-6 text-gray-300" />
              </button>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-md shadow-lg p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.designation || 'User'}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            {/* Date and Time */}
            <span className="text-sm text-gray-300">{formatDateTime(currentTime)}</span>
          </div>
        )}
      </div>

      {/* Inline CSS for Starry Background and Glow Effect */}
      <style jsx>{`
        .stars {
          width: 1px;
          height: 1px;
          position: absolute;
          background: #d1d5db;
          box-shadow:
            2vw 5vh 2px #d1d5db,
            10vw 8vh 2px #d1d5db,
            15vw 15vh 1px #d1d5db,
            22vw 22vh 1px #d1d5db,
            28vw 12vh 2px #d1d5db,
            32vw 32vh 1px #d1d5db,
            38vw 18vh 2px #d1d5db,
            42vw 35vh 1px #d1d5db,
            48vw 25vh 2px #d1d5db,
            53vw 42vh 1px #d1d5db,
            58vw 15vh 2px #d1d5db,
            63vw 38vh 1px #d1d5db,
            68vw 28vh 2px #d1d5db,
            73vw 45vh 1px #d1d5db,
            78vw 32vh 2px #d1d5db,
            83vw 48vh 1px #d1d5db,
            88vw 20vh 2px #d1d5db,
            93vw 52vh 1px #d1d5db,
            98vw 35vh 2px #d1d5db,
            5vw 60vh 1px #d1d5db,
            12vw 65vh 2px #d1d5db,
            18vw 72vh 1px #d1d5db,
            25vw 78vh 2px #d1d5db,
            30vw 85vh 1px #d1d5db,
            35vw 68vh 2px #d1d5db,
            40vw 82vh 1px #d1d5db,
            45vw 92vh 2px #d1d5db,
            50vw 75vh 1px #d1d5db,
            55vw 88vh 2px #d1d5db,
            60vw 95vh 1px #d1d5db,
            65vw 72vh 2px #d1d5db,
            70vw 85vh 1px #d1d5db,
            75vw 78vh 2px #d1d5db,
            80vw 92vh 1px #d1d5db,
            85vw 82vh 2px #d1d5db,
            90vw 88vh 1px #d1d5db,
            95vw 75vh 2px #d1d5db;
        }

        .stars::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 1px;
          background: #d1d5db;
          box-shadow:
            8vw 12vh 2px #d1d5db,
            16vw 18vh 1px #d1d5db,
            24vw 25vh 2px #d1d5db,
            33vw 15vh 1px #d1d5db,
            41vw 28vh 2px #d1d5db,
            49vw 35vh 1px #d1d5db,
            57vw 22vh 2px #d1d5db,
            65vw 42vh 1px #d1d5db,
            73vw 28vh 2px #d1d5db,
            81vw 48vh 1px #d1d5db,
            89vw 32vh 2px #d1d5db,
            97vw 45vh 1px #d1d5db,
            3vw 68vh 2px #d1d5db,
            11vw 75vh 1px #d1d5db,
            19vw 82vh 2px #d1d5db,
            27vw 88vh 1px #d1d5db,
            35vw 72vh 2px #d1d5db,
            43vw 85vh 1px #d1d5db,
            51vw 92vh 2px #d1d5db,
            59vw 78vh 1px #d1d5db;
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(25deg);
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(50vh) rotate(25deg);
            opacity: 0;
          }
        }

        .animate-shoot {
          animation: shoot 3s infinite ease-in;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }

        .glow-effect {
          box-shadow: 0 0 10px 2px rgba(209, 213, 219, 0.5); /* Light gray glow */
        }
      `}</style>
    </motion.header>
  );
};

export default HeaderUI;