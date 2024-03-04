import React, { useEffect,useState } from "react";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { acceptedRequests, acceptedRequests2, pendingRequests, pendingRequests2 } from './../../Firebase/FirebaseFunctions';
import { auth } from "../../Firebase/FirebaseConfig";

const LeftFeedSection = ({ user }) => {
  const [acceptConnectionRequest, setAcceptConnectionRequest] = useState([]);
const [acceptConnectionRequest2, setAcceptConnectionRequest2] = useState([]);
const [pendingConnectionRequest, setpendingConnectionRequest] = useState([]);
const [pendingConnectionRequest2, setpendingConnectionRequest2] = useState([]);


  useEffect(() => {
    acceptedRequests(auth.currentUser.uid).then((e) => setAcceptConnectionRequest(e));
     acceptedRequests2(auth.currentUser.uid).then((e) => setAcceptConnectionRequest2(e));
     pendingRequests(auth.currentUser.uid).then((e) =>
       setpendingConnectionRequest(e)
     );
     pendingRequests2(auth.currentUser.uid).then((e) =>
       setpendingConnectionRequest2(e)
     );
  }, []);
  const acceptedRequestsNumber=acceptConnectionRequest.length+acceptConnectionRequest2.length
  const pending = pendingConnectionRequest.length + pendingConnectionRequest2.length
  
  return (
    <div className="hidden lg:block border rounded-xl bg-white w-56 shadow-xl">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="border rounded-t-xl h-1/2 flex flex-col justify-center items-center p-4">
          <Avatar
            size="lg"
            name={user?.displayName[0]}
            className="text-4xl bg-[#915907] text-white"
            isBordered
            as="button"
          />
          <div className="font-semibold text-center mt-3">
            {user?.displayName}
          </div>
          <div className="text-sm text-center">
            Student at Guru Gobind Singh University
          </div>
        </div>

        {/* User Stats */}
        <div className="border h-1/4 flex flex-col justify-center items-center p-4">
          <div className="text-lg">
            Your connections: {acceptedRequestsNumber}
          </div>
          <div className="text-lg">Requests: {pending}</div>
        </div>

        {/* Premium Section */}
        <div className="border h-1/4 flex flex-col justify-center items-center p-4">
          <div>Try premium</div>
        </div>

        {/* User Posts */}
        <div className="border rounded-b-xl h-1/4 flex flex-col justify-center items-center p-4">
          <Link to={`/yourposts/${user?.uid}`} className="text-blue-600">
            Your Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftFeedSection;
