import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useAuthStatus,
  login,
  loginWithGoogle,
} from "../Firebase/FirebaseFunctions";
import GoogleSvg from "./GoogleSvg";

const LoginPage = () => {
const status = useAuthStatus();
console.log(status);
const [pw, setpw] = useState("");
const [email, setEmail] = useState("");
const navigate = useNavigate();
const { isLoggedin } = useAuthStatus();
useEffect(() => {
  if (isLoggedin) {
    navigate("/feed");
  }
}, [isLoggedin,navigate]);



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(email, pw);
    // Set logged in status in local storage upon successful login
   
  } catch (error) {}
};

const loginGoogle = async () => {
  try {
    await loginWithGoogle();
    // Set logged in status in local storage upon successful login
   
  } catch (error) {}
};
const goToRegister = () => {
  navigate("/register");
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200 font-sans">
        <div className="max-w-md w-full">
          <motion.h1
            className="text-3xl font-bold mb-4 text-center font-sans"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Login to your Account
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className=" lg:max-w-96 max-w-80 w-full bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-[3px] ml-[1.5px]"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 mb-[3px] ml-[1.5px]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter your password"
              onChange={(e) => setpw(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-600 transition duration-300 mb-2 text-lg"
            
          >
            Log in
          </button>
          <div className="flex items-center mb-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-4 text-gray-500 font-bold">or</span>
            <hr className="w-full border-gray-300" />
          </div>
          <motion.button
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-full bg-white text-gray-700 py-2 px-4 rounded-3xl border border-gray-300 hover:bg-gray-100 transition duration-300"
            onClick={loginGoogle}
          >
            <GoogleSvg />
            Continue with Google
          </motion.button>
          <motion.button
            className="mt-4 flex items-center justify-center w-full bg-white text-gray-700 py-2 px-4 rounded-3xl border border-gray-300 hover:bg-gray-100 transition duration-300"
            onClick={goToRegister}
          >
            New to Linkedin? Join now
          </motion.button>
        </motion.div>
      </div>
    </form>
  );
};

export default LoginPage;
