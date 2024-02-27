import React from "react";
import { Avatar } from "@nextui-org/react";
import ArticleSvg from "../Svgs/ArticleSvg";
import EventSvg from "../Svgs/EventSvg";
import GallerySvg from "../Svgs/GallerySvg";
import { motion } from "framer-motion";
import Modal from "./Modal";
import PostFeedCard from "./PostsFeedSection/PostFeedCard";
import PostsFeedSection from "./PostsFeedSection/PostsFeedSection";
const MiddleFeedSection = ({
  handleButtonClick,
  isModalOpen,
  handleCloseModal,
  user,
}) => {
  return (
    <div
      id="middle"
      className="border  md:w-2/4 w-[screen]  rounded-xl bg-[#ffffff] h-[8rem] "
    >
      <div className="mb-11 border border-solid rounded-xl h-32 w-[22rem] md:w-auto shadow-xl">
        <div className="flex mt-4 md:justify-center  justify-around gap-5 mx-5">
          <div className="flex-[0.2]">
            <Avatar
              name={user?.displayName[0]}
              className="text-2xl bg-[#915907] text-white"
              isBordered
              as="button"
            />
          </div>

          <button
            className="block md:flex  bg-white border border-gray-300 text-gray-700 py-2 px-4 focus:border-blue-500 md:w-full w-80 rounded-3xl text-start"
            onClick={handleButtonClick}
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-around md:gap-20 gap-5 mt-6 md:mx-10">
          <div className="flex gap-1 items-center">
            <GallerySvg />
            <h2 className=" md:text-lg text-sm">Media</h2>
          </div>

          <div className="flex gap-1 items-center">
            <EventSvg />
            <h2 className=" md:text-lg text-sm">Event</h2>
          </div>
          <div className="flex gap-1 items-center">
            <ArticleSvg />
            <h2 className=" md:text-lg text-sm">Article</h2>
          </div>
        </div>
      </div>
      <PostsFeedSection />
      <br />

      <Modal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default MiddleFeedSection;
