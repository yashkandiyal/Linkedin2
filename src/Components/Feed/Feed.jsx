import React, { useState } from "react";
import MyNavbar from "./../Navbar/Navbar";
import { useAuthStatus } from "../Firebase/FirebaseFunctions";
import LeftFeedSection from "./FeedComponents/LeftFeedSection";
import MiddleFeedSection from "./FeedComponents/MiddleFeedSection";
import RightFeedSection from "./FeedComponents/RightFeedSection";
 
const Feed = () => {
  const { user } = useAuthStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="bg-[#f4f2ee]">
        <MyNavbar />
        <div className="bg-[#f4f2ee] min-h-screen">
          <div className="pt-16 px-10 md:px-36">
            <div id="main-container" className="flex justify-center md:gap-12">
              <LeftFeedSection user={user} />
              <MiddleFeedSection
                handleButtonClick={handleButtonClick}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                user={user}
              />
              <RightFeedSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
