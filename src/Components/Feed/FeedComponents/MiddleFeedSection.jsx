import React from "react";
import { Avatar } from "@nextui-org/react";
import ArticleSvg from "../Svgs/ArticleSvg";
import EventSvg from "../Svgs/EventSvg";
import GallerySvg from "../Svgs/GallerySvg";
import Modal from "./Modal";
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
      className="border  lg:w-2/4 w-[screen]  rounded-xl bg-[#ffffff] h-[8rem] "
    >
      <div className="mb-11 border border-solid rounded-xl h-32 w-[23rem] lg:w-auto shadow-xl">
        <div className="flex mt-4 lg:justify-center  justify-around gap-5 mx-5">
          <div className="flex-[0.2]">
            <Avatar
              name={user?.displayName[0]}
              className="text-2xl bg-[#915907] text-white"
              isBordered
              as="button"
            />
          </div>

          <button
            className="block lg:flex  bg-white border border-gray-300 text-gray-700 py-2 px-4 focus:border-blue-500 lg:w-full w-80 rounded-3xl text-start"
            onClick={handleButtonClick}
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-around lg:gap-20 gap-5 mt-6 lg:mx-10">
          <div
            className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 hover:rounded-lg  p-[0.35rem]"
            onClick={handleButtonClick}
          >
            <GallerySvg />
            <h2 className=" lg:text-lg text-sm">Media</h2>
          </div>

          <div
            className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 hover:rounded-lg  p-[0.35rem]"
            onClick={handleButtonClick}
          >
            <EventSvg />
            <h2 className=" lg:text-lg text-sm ">Event</h2>
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer hover:bg-slate-100 hover:rounded-lg  p-[0.35rem]"
            onClick={handleButtonClick}
          >
            <ArticleSvg />
            <h2 className=" lg:text-lg text-sm">Article</h2>
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
