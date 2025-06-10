import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '/Users/USER/Desktop/test_manager_tool/src/components/logo.png';

const LoginUI = ({ username, setUsername, password, setPassword, handleLogin, handleForgotPassword }) => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-[#d7d4d1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <motion.img
        src= {logoImage}
        alt=""
        className="mx-auto mb-6 w-30 h-24"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />
        <h2 className="text-2xl font-bold text-center text-[#5e342c] mb-6">Login</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#374151]">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-colors"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-[#22c55e] text-white rounded-md hover:bg-[#16a34a] transition-colors duration-300"
          >
            Login
          </button>
          <button
            onClick={handleForgotPassword}
            className="mt-4 w-full py-2 bg-[#e5e7eb] text-[#1f2937] rounded-md hover:bg-[#daa55f] transition-colors duration-300"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      </motion.div>
  )
};

export default LoginUI;