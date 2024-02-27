import React, { useEffect, useState } from "react";
import PostFeedCard from "./PostFeedCard";
import { fetchData } from "../../../Firebase/FirebaseFunctions";

const PostsFeedSection = () => {
  const [posts, setPosts] = useState([]);

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
  }, [posts]); // Empty dependency array ensures this effect runs only once
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
    <div className="flex flex-col gap-5">
      {posts.map((post, index) => (
        <PostFeedCard
          key={index}
          name={post.name}
          message={post.message}
          timestamp={post.timestamp ? formatDate(post.timestamp) : ""}
          userId={post.id} // Pass userId directly
          postId={post.postId} // Pass postId directly
        />
      ))}
    </div>
  );
};

export default PostsFeedSection;
