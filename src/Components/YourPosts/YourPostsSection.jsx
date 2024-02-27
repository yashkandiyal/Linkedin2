import React, { useEffect, useState } from "react";
import { fetchData } from "../Firebase/FirebaseFunctions";
import YourPostsCard from "./YourPostsCard";
import { useAuthStatus } from "../Firebase/FirebaseFunctions";
import { auth } from "../Firebase/FirebaseConfig";
import MyNavbar from "../Navbar/Navbar";

const PostsFeedSection = () => {
  const { user } = useAuthStatus();
  const [posts, setPosts] = useState([]);
  const currentUserID = user?.uid;

  useEffect(() => {
    const fetchDataAndSetPosts = async () => {
      try {
        const data = await fetchData(); // Fetch data
        setPosts(data); // Set fetched data to state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndSetPosts();
  }, []); // Empty dependency array ensures this effect runs only once

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

  const filteredPosts = posts.filter((post) => post.id === currentUserID);

  return (
    <>
      <MyNavbar />
     
      <div className="flex flex-col gap-5">
        {filteredPosts.length === 0 ? (
          <>
            <h1 className="text-center text-gray-500 text-4xl mt-48">
              <span role="img" aria-label="Start posting something">
                🚀
              </span>{" "}
              Start posting something
            </h1>
          </>
        ) : (
          <>
            {filteredPosts.map((post, index) => (
              <YourPostsCard
                key={index}
                name={post.name}
                message={post.message}
                timestamp={post.timestamp ? formatDate(post.timestamp) : ""}
                userId={post.userId}
                postId={post.postId}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default PostsFeedSection;
