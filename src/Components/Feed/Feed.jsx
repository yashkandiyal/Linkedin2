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
      <MyNavbar />
      <div className="">
        <div
          id="main-container"
          className="flex justify-center md:gap-12 p-10 mx-36 "
        >
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
    </>
  );
};

export default Feed;
