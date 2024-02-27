import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar } from "@nextui-org/react";
import { getLikesCount } from "../Firebase/FirebaseFunctions";

const YourPostsCard = ({ name, message, userId, postId, timestamp }) => {
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getLikesCount(postId);
        setLikesCount(count);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchData();
  }, [postId]);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      
      <div className="rounded-xl flex flex-col bg-[#ffffff] shadow-md md:w-[40%] w-[22rem]">
        <div className="h-20 flex items-center gap-2 pl-5 ">
          <Avatar className="text-2xl bg-[#915907] text-white " />
          <div>
            <div className="flex justify-between items-center md:gap-[23rem] gap-[20vh]">
              <div className="text-sm font-medium">{name}</div>
            </div>
            <div className="text-xs ">Software Engineer</div>
            <div className="text-xs">posted {timestamp}</div>
          </div>
        </div>{" "}
        {/* Example height */}
        <div className="grid grid-rows-[auto,1fr,auto]">
          <div className="border "></div> {/* Empty grid area */}
          <div className="overflow-auto  pl-5">
            <p className="whitespace-pre-wrap my-2">{message}</p>
          </div>
          <div className="border "></div> {/* Empty grid area */}
        </div>
        <div className="h-[2.2rem] flex justify-center items-center md:gap-[2.9rem] gap-[2.7rem] my-2">
          <div className="group flex items-center gap-1 transform transition-transform hover:bg-blue-100 p-3 rounded-xl">
            <ThumbUpIcon className="text-gray-500" fontSize="medium" />
            <div className="group-hover:text-blue-500 cursor-pointer">
              <span>({likesCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourPostsCard;
