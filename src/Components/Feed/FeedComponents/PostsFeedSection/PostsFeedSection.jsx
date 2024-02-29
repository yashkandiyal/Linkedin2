import React, { useEffect, useState } from "react";
import PostFeedCard from "./PostFeedCard";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

const PostsFeedSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const newPosts = [];
      snapshot.forEach((doc) => {
        newPosts.push({ postId: doc.id, ...doc.data() });
      });

      // Sort the newPosts array based on the timestamp
      newPosts.sort((a, b) => b.timestamp - a.timestamp);

      setPosts(newPosts);
    });

    return () => unsubscribe(); 
  }, []); 
 
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
    <div className="flex flex-col gap-5 ">
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
