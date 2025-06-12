import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '/Users/USER/Desktop/test_manager_tool/src/components/logo.png';

const LoginUI = ({ username, setUsername, password, setPassword, handleLogin, handleForgotPassword }) => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-sm p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
        <motion.img
          src={logoImage}
          alt="Logo"
          className="mx-auto mb-4 w-24 h-20"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />
        <h2 className="text-xl font-semibold text-center text-white mb-4">Login</h2>
        <div className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 bg-white/[0.02] border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 bg-white/[0.02] border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            Login
          </button>
          <button
            onClick={handleForgotPassword}
            className="w-full py-2 bg-transparent text-gray-100 border border-white/10 rounded-md hover:bg-white/[0.05] transition-colors duration-300"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginUI;