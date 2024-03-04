import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@nextui-org/react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  getComments,
  getLikesCount,
  isPostLikedByUser,
  likePost,
  postComments,
  useAuthStatus,
} from "../../../Firebase/FirebaseFunctions";
import { auth, firebaseApp } from "../../../Firebase/FirebaseConfig";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import DropDown from "./dropDown";
import { motion } from "framer-motion";
const PostFeedCard = ({ name, message, userId, postId, timestamp }) => {
  const { user, isLoggedin } = useAuthStatus();
  const myname = user?.displayName;
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const db = getFirestore(firebaseApp);
  const [isClicked, setIsClicked] = useState(false);
  const [comment, setComment] = useState("");
  const [userComments, setUserComments] = useState([]);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const getCommentsByUser = () => {
    getComments(postId, (comments) => {
      // Sort comments based on the timestamp property in descending order
      comments.sort((a, b) => b.timestamp - a.timestamp);

      // Set the sorted comments using setUserComments
      setUserComments(comments);
    });
  };

  const handleComments = async () => {
    try {
      await postComments(myname, postId, comment);
      setComment("");
    } catch (error) {
      console.error("Error storing comment:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;

        const [count, liked] = await Promise.all([
          getLikesCount(postId),
          isPostLikedByUser(userId, postId),
        ]);
        setLikesCount(count);
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [postId]);

  const handleLike = useCallback(() => {
    const userId = auth.currentUser.uid;
    // Optimistically update UI
    setLikesCount((prevCount) => prevCount + (isLiked ? -1 : 1));
    setIsLiked(!isLiked);
    setIsClicked(true); // Set state to indicate that the button is clicked

    likePost(userId, postId, auth.currentUser.displayName)
      .then(() => {
        console.log("Like toggled successfully");
        setIsClicked(false); // Reset state after successful like action
      })
      .catch((error) => {
        console.error("Error toggling like:", error);
        // Revert UI changes if there's an error
        setLikesCount((prevCount) => prevCount + (isLiked ? 1 : -1));
        setIsLiked(!isLiked);
        setIsClicked(false); // Reset state if there's an error
      });
  }, [postId, isLiked]);
  const currentUserID = auth.currentUser?.uid;
  const handleDelete = useCallback(() => {
    if (currentUserID === userId) {
      try {
        const postDocRef = doc(db, "posts", postId);
        deleteDoc(postDocRef)
          .then(() => {
            console.log("Post deleted successfully");
            // Handle post deletion, such as updating UI or showing a notification
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
          });
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }, [postId, userId]);
  useEffect(() => {
    getCommentsByUser();
  }, [userComments]);

  const handleClick = () => {
    setIsCommentExpanded((prev) => !prev);
  };
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

    return new Date(timestamp.toDate()).toLocaleString("en-US", options);
  };

  return (
    <div className="rounded-xl flex flex-col bg-[#ffffff] shadow-lg lg:w-auto w-full md:max-w-full">
      <div id="firstpart" className="h-20 flex items-center gap-2 pl-5">
        <Avatar className="text-2xl bg-[#915907] text-white" />
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">{name}</div>
            {currentUserID === userId && (
              <DropDown handleDelete={handleDelete} />
            )}
          </div>
          <div className="text-xs">Software Engineer</div>
          <div className="text-xs">posted {timestamp}</div>
        </div>
      </div>
      {/* Example height */}
      <div className="grid grid-rows-[auto,1fr,auto]">
        <div className="border"></div> {/* Empty grid area */}
        <div id="secondpart" className="overflow-auto pl-5">
          <p className="whitespace-pre-wrap my-2">{message}</p>
        </div>
        <div className="border"></div> {/* Empty grid area */}
      </div>
      <div className="h-[2.2rem] flex justify-center items-center mx-auto  my-2 w-fit gap-10 lg:gap-10">
        <div
          className="group flex items-center gap-1 transform transition-transform hover:bg-blue-100 p-3 rounded-xl"
          onClick={handleLike}
        >
          <ThumbUpIcon
            className={`${isLiked ? "text-blue-600" : "text-gray-500"} `}
            fontSize="medium"
          />
          <div className="group-hover:text-blue-500 cursor-pointer">
            {isLiked ? (
              <div>
                <span> ({likesCount})</span>
              </div>
            ) : (
              <>
                {likesCount === 0 ? (
                  <span className="hidden lg:inline">Like</span>
                ) : (
                  <div>
                    <span className="hidden lg:inline">Like</span>
                    <span> ({likesCount})</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className="group flex items-center gap-1 transform transition-transform hover:bg-green-100 p-3 rounded-xl"
          onClick={handleClick}
        >
          <CommentIcon
            className="text-gray-500 group-hover:text-green-500 group-hover:bg-green-100 hover:scale-110 rounded-full transition-all"
            fontSize="medium"
          />
          <div className="group-hover:text-green-500 cursor-pointer flex gap-1">
            <span className="lg:block hidden">Comment</span>{" "}
            <span>
              {userComments.length > 0 ? (
                <span>({userComments.length})</span>
              ) : (
                <></>
              )}
            </span>
          </div>
        </div>
        <div className="group flex items-center gap-1 transform transition-transform hover:bg-purple-100 p-3 rounded-xl">
          <SendIcon
            className="text-gray-500 group-hover:text-purple-500 group-hover:bg-purple-100 hover:scale-110  rounded-full transition-all"
            fontSize="medium"
          />
          <div className="group-hover:text-purple-500 cursor-pointer hidden lg:block">
            Share
          </div>
        </div>
        <div className="group flex items-center gap-1 transform transition-transform hover:bg-red-100 p-3 rounded-xl">
          <AutorenewIcon
            className="text-gray-500 group-hover:text-red-500 group-hover:bg-red-100 hover:scale-110  rounded-full transition-all"
            fontSize="medium"
          />
          <div className="group-hover:text-red-500 cursor-pointer hidden lg:block">
            Repost
          </div>
        </div>
      </div>
      {isCommentExpanded && (
        <motion.div
          className="p-5 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <motion.textarea
            className="w-full border rounded-lg p-3 mb-4 break-words h-auto text-sm" // Adjust styling properties
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          ></motion.textarea>

          <motion.button
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" // Adjust styling properties
            onClick={handleComments}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Submit
          </motion.button>

          {userComments.length > 0 && (
            <div className="mt-4 space-y-5 break-all">
              {userComments.map((comment, index) => (
                <>
                  {userComments.length > 0 && <div className="border-t"></div>}
                  <motion.div
                    key={comment.id}
                    className="flex items-start space-x-3  pt-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {" "}
                    <div>
                      <Avatar
                        className="text-2xl bg-[#915907] text-white"
                        name={comment.myname?.charAt(0) || ""}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-700 text-xs mb-1">
                        {comment.timestamp ? formatDate(comment.timestamp) : ""}
                      </p>
                      <p className="text-gray-900 break-words text-sm">
                        {comment.myname}: {comment.comment}
                      </p>
                    </div>
                  </motion.div>
                </>
              ))}
              {userComments.length > 0 && <div className="border-t"></div>}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PostFeedCard;
