import React, { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";
import MyNavbar from "../Navbar/Navbar";
import { fetchData } from "../Firebase/FirebaseFunctions";

const NotificationsSection = () => {
  const [uniqueUsers, setUniqueUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchData();
        console.log(data);
        // Extract unique users from posts data
        const uniqueUsersMap = new Map(); // Map to store unique users by ID
        data.forEach((post) => {
          uniqueUsersMap.set(post.id, { id: post.id, name: post.name });
        });

        // Convert Map values to array
        const uniqueUsersArray = Array.from(uniqueUsersMap.values());

        // Update state with unique users
        setUniqueUsers(uniqueUsersArray);
        
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    
    fetchPosts();
  }, []);
  console.log(uniqueUsers);
  return (
    <>
      <MyNavbar />
      <div className="md:flex gap-5 justify-center items-center flex flex-wrap">
        {/* Render unique users using NotificationCard component */}
        {uniqueUsers.map((user) => (
          <div key={user.id} className="mb-5 md:w-1/2 lg:w-1/3 xl:w-1/4">
            <NotificationCard userId={user.id} name={user.name} />
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationsSection;
