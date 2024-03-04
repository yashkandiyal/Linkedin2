import React, { useState, useEffect } from "react";
import ConnectionsCard from "./connectionsCard";
import MyNavbar from "./../Navbar/Navbar";
import { checkConnectionRequestsData } from "../Firebase/FirebaseFunctions";
import { auth } from "../Firebase/FirebaseConfig";

const ConnectionSection = () => {
  const loggedInUser = auth.currentUser?.uid;
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = await checkConnectionRequestsData(loggedInUser);

        // Filter requests for the current logged-in user as the receiver or sender
        const filteredRequests = requests.filter((request) => {
          return (
            (request.data.receiverId === loggedInUser ||
              request.data.senderId === loggedInUser) &&
            request.status !== "accepted"
          );
        });

        // Sort filteredRequests based on timestamp
        const sortedRequests = filteredRequests.sort((a, b) => {
          return (b.data.timestamp) - (a.data.timestamp);
        });

        setFilteredRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching connection info:", error);
      }
    };

    fetchData(); // Call the fetch function here
  }, [loggedInUser]);

console.log(filteredRequests);
 
const formatDate = (timestamp) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Use 24-hour format
  };

  // Ensure that timestamp is defined before calling toDate()
  return timestamp
    ? new Date(timestamp.toDate()).toLocaleString("en-US", options)
    : "";
};

  return (
    <>
      <MyNavbar />
      <div className="flex justify-center gap-5 flex-col  md:flex-row items-center">
        {filteredRequests.map((request) => (
          <ConnectionsCard
            key={request.id} // Ensure each component has a unique key
            userId={request.data.senderId}
            receiver={request.data.receiverId}
            connectionId={request.id}
            status={request.data.status}
            senderName={request.data.senderName}
            receiverName={request.data.receiverName}
            timestamp={
              request.data.timestamp ? formatDate(request.data.timestamp) : ""
            }
          />
        ))}
      </div>
    </>
  );
};

export default ConnectionSection;
