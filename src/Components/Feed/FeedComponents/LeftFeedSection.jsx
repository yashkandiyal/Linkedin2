import React from "react";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

const LeftFeedSection = ({ user }) => {
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
          <div className="text-lg">Your connections: 100</div>
          <div className="text-lg">Requests: 3</div>
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
