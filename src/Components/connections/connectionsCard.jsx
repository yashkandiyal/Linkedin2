import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/react";
import {
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnectionsByStatus,
  updateConnectionRequestStatus,
  checkConnectionRequest,
} from "../Firebase/FirebaseFunctions";
import { auth } from "../Firebase/FirebaseConfig";

const ConnectionsCard = ({
  userId,
  receiver,
  connectionId,
  status,
  senderName,
  receiverName,
  
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const [connectionAccepted, setConnectionAccepted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("pending");
  const [connectionList, setConnectionList] = useState([]);
  const [show,setshow]=useState(false)
  useEffect(() => {
    
  checkConnectionRequest(userId,receiver).then((e)=>setshow(e));
   
  }, [])
  
  useEffect(() => {
    getConnectionsByStatus(receiver, userId)
      .then((connections) => setConnectionList(connections))
      .catch((error) => console.error("Error fetching connections:", error));
  }, [receiver, userId, connectionList, connectionStatus, connectionAccepted,show]);

  const loggedInUser = auth.currentUser?.uid;

  const acceptConnection = async () => {
    try {
      await acceptConnectionRequest(connectionId);
      setConnectionAccepted(true);
      setConnectionStatus("accepted");
      // Update connection status to "accepted"
      await updateConnectionRequestStatus(connectionId, "accepted");
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const declineConnection = async () => {
    try {
      await declineConnectionRequest(connectionId);
      setRequestSent(true);
      // Update connection status to "declined"
      setConnectionStatus("declined");
      await updateConnectionRequestStatus(connectionId, "declined");
    } catch (error) {
      console.error("Error declining connection:", error);
    }
  };

  return (
    <div className="mt-10">
      {loggedInUser === userId && status === "accepted" && (
        <div className="bg-slate-300 w-fit p-6 text-lg">
          <p className="text-gray-700 text-lg">
            Connected with: {receiverName}
          </p>
          <p className="text-gray-500">Studies at: GGSIPU</p>
        </div>
      )}

      {loggedInUser === receiver && (
        <>
          {connectionStatus === "accepted" && (
            <>
              <div className="bg-slate-300 w-fit p-6 text-lg">
                <p className="text-gray-700">Connected with: {senderName}</p>
                <p className="text-gray-500">Studies at: GGSIPU</p>
              </div>
            </>
          )}

          {status === "accepted" && connectionStatus !== "accepted" && (
            <div className="bg-slate-300 w-fit p-6 text-lg">
              <p className="text-gray-700">Connected with: {senderName}</p>
              <p className="text-gray-500">Studies at: GGSIPU</p>
            </div>
          )}

          {connectionStatus === "declined" && (
            <h3 className="text-red-500 text-xl">
              Request declined successfully
            </h3>
          )}

          {status === "pending" && connectionStatus !== "accepted" && (
            <div className="flex items-center">
              {connectionStatus === "declined" ? (
                <></>
              ) : (
                <>
                  <p className="text-gray-700 mr-4">
                    Sender name: {senderName}
                  </p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={acceptConnection}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={declineConnection}
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionsCard;
