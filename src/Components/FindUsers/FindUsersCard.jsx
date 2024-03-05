import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Avatar } from "@nextui-org/react";
import {
  sendConnectionRequest,
  checkConnectionRequest,
  
} from "../Firebase/FirebaseFunctions";
import { auth } from "../Firebase/FirebaseConfig";
import DoneIcon from "@mui/icons-material/Done";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FindUsersCard = ({ name, userId }) => {
  const loggedInUser = auth.currentUser?.uid;
  const [requestSent, setRequestSent] = useState(false);
  const [connectionExists, setConnectionExists] = useState(false);
  const sendRequest = async () => {
    try {
      await sendConnectionRequest(
        auth.currentUser.uid,
        userId,
        auth.currentUser.displayName,
        name
      );
      toast.success("Connection request sent successfully")
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setConnectionExists(await checkConnectionRequest(loggedInUser, userId));
      } catch (error) {
        console.error("Error fetching connection info:", error);
      }
    };

    fetchData(); // Call the fetch function here
  }, [loggedInUser, userId]);

  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const hasExistingRequest = await checkConnectionRequest(
          auth.currentUser.uid,
          userId
        );
        setRequestSent(hasExistingRequest);
      } catch (error) {
        console.error("Error checking existing request:", error);
      }
    };

    checkExistingRequest();
  }, [userId, requestSent, connectionExists]);

  return (
    <>
    <ToastContainer/>
    <motion.div
      className={`
        bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full mt-10 gap-6
        
           "opacity-50 cursor-not-allowed" 
        
      `}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      style={{ border: "1px solid #e0e0e0" }}
    >
      <div className="flex items-center">
        <Avatar alt={name} name={name[0]} className="bg-blue-500 text-xl" />
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-500">Student at: ggsipu</p>
        </div>
      </div>
      {connectionExists && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DoneIcon className="text-green-500" />
        </motion.div>
      )}
      {!requestSent && !connectionExists && (
        <>
          {auth.currentUser.uid === userId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-blue-500"
            >
              You
            </motion.div>
          )}
          {auth?.currentUser.uid !== userId && (
            <PersonAddAlt1Icon
              className="text-blue-500 cursor-pointer hover:text-blue-700 hover:rounded-full hover:bg-blue-100 p-[0.35rem]"
              onClick={sendRequest}
              fontSize="large"
            />
          )}
        </>
      )}
    </motion.div>
    </>
    
  );
};

export default FindUsersCard;
