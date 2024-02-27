import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser,useAuthStatus } from "../Firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate=useNavigate()
  const [show, setShow] = useState(false);
  const [pw, setpw] = useState("");
  const [pw2, setpw2] = useState("");
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const showPassword = () => {
    setShow((prev) => !prev);
  };

  // validate password and confirm password
  
  const validate = async () => {
    if (pw !== pw2 && pw !== "" && pw2 !== "") {
      toast.warning("Please enter the same passwords in both input fields");
      setpw("");
      setpw2("");
      return;
    }
  };
  const SubmitFunction = async (e) => {
    e.preventDefault(); // Move the preventDefault() call here

    try {
      // Call the createUser function and wait for it to complete
      await createUser(email, pw, first, second);
      // If registration is successful, display a success message
      toast.success("Registration successful!");
      navigate('/')
    } catch (error) {
      // If registration fails, display an error message
      toast.error(error.message);
    }
  };
  const status = useAuthStatus();
  const { isLoggedin } = useAuthStatus();
  
  return (
    <div>
      
      <form onSubmit={SubmitFunction}>
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 font-roboto">
          <ToastContainer />
          <div className=" max-w-md w-full">
            <motion.h1
              className="text-3xl font-bold mb-4 text-center font-sans"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Create your Account
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-96 w-full bg-white p-8 rounded-lg shadow-lg"
          >
            <div className="mb-3">
              <label
                htmlFor="firstName"
                className="block text-gray-700 mb-[3px] ml-[1.5px]"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Enter your first name"
                required
                onChange={(e) => setFirst(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-gray-700 mb-[3px] ml-[1.5px]"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Enter your last name"
                onChange={(e) => setSecond(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 mb-[3px] ml-[1.5px]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 mb-[3px] ml-[1.5px]"
              >
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 pr-12"
                placeholder="Enter your password"
                onChange={(e) => setpw(e.target.value)}
                required
              />
              <button
                className="absolute inset-y-12 right-0 px-3 flex items-center justify-center"
                onClick={showPassword}
              >
                <VisibilitySharpIcon />
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmpassword"
                className="block text-gray-700 mb-[3px] ml-[1.5px]"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmpassword"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
                placeholder="Confirm your password"
                required
                onChange={(e) => setpw2(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-600 transition duration-300 mb-2 text-lg"
              onClick={validate}
            >
              Register
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default Register;
