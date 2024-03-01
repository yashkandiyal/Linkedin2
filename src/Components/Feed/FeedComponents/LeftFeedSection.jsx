import React from "react";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

const LeftFeedSection = ({ user }) => {
  return (
    <div>
      <div
        id="left"
        className="hidden lg:block  border  h-96 rounded-xl bg-[#ffffff] w-56 shadow-xl"
      >
        <div id="userProfile" className=" flex flex-col h-full ">
          <div
            id="part1"
            className="border-solid border rounded-t-xl  h-1/2 w-full flex flex-col justify-center items-center relative gap-2"
          >
            <Avatar
              size="lg"
              name={user?.displayName[0]}
              className="text-4xl bg-[#915907] text-white "
              isBordered
              as="button"
            />
            <div className=" font-semibold">{user?.displayName}</div>
            <div className=" text-center text-sm font-sans">
              Student at <br /> Guru Gobind Singh University
            </div>
          </div>
          <div
            id="part2"
            className="border-solid border h-1/4 w-full flex flex-col justify-center items-center"
          >
            <div className="text-lg">Your connections-100 </div>
            <div className="text-lg">Requests-3</div>
          </div>
          <div
            id="part3-premium"
            className="border-solid border h-1/4 w-full flex flex-col justify-center items-center"
          >
            <div>Try premium</div>
          </div>
          <div
            id="part4"
            className="border-solid border rounded-b-xl h-1/4 w-full flex flex-col justify-center items-center"
          >
            <Link to={`/yourposts/${user?.uid}`}>Your Posts</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftFeedSection;
