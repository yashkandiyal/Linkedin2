import React, { useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { storeData } from "../../Firebase/FirebaseFunctions"; // Import storeData function
import { useAuthStatus } from "../../Firebase/FirebaseFunctions"; // Import useAuthStatus hook
import { ToastContainer, toast } from "react-toastify";

const Modal = ({ isModalOpen, handleCloseModal }) => {
  const { user } = useAuthStatus();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handlePost = async () => {
    try {
      if (!message.trim()) {
        // Check if the message is empty or contains only whitespace
        toast.error("Please enter something before posting");
        return; // Exit the function if the message is empty
      }

      if (user) {
        setIsLoading(true); // Set loading to true when post button is clicked
        await storeData(user.displayName, message, user.uid);
        setMessage("")
        console.log("Data stored successfully!");
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error("Error storing data:", error);
    } finally {
      setIsLoading(false); // Set loading to false when promise is fulfilled
      handleCloseModal();
    }
  };

  return (
    <>
      <ToastContainer />
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white shadow-md p-5 rounded-md flex flex-col gap-4 w-full max-w-md"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Write Something
              </h2>
              <button onClick={handleCloseModal} className="focus:outline-none">
                <CloseIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            <textarea
              id="modalTextarea"
              className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500"
              cols="40"
              rows="3"
              placeholder="How are you feeling today?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div>
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium focus:outline-none ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePost}
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 2.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L11 5.414V15a1 1 0 1 1-2 0V5.414L4.707 9.707a1 1 0 1 1-1.414-1.414l6-6zM10 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Post
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Modal;
