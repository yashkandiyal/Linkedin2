import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Loginpage from "./Components/LoginPage/Loginpage";
import Register from "./Components/RegisterPage/Register";
import Feed from "./Components/Feed/Feed";
import { useAuthStatus } from "./Components/Firebase/FirebaseFunctions";
import { Navigate } from "react-router-dom";
import YourPostsSection from "./Components/YourPosts/YourPostsSection";
import ConnectionSection from "./Components/connections/connectionSection";
import FindUsersSection from "./Components/FindUsers/FindUsersSection";
const App = () => {
  const { isLoggedin } = useAuthStatus();
  return (
    <div className="bg-[#f4f2ee] min-h-screen">
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed/notifications" element={<FindUsersSection />} />
        <Route path="/findusers" element={<FindUsersSection />} />
        <Route path="/yourposts/:userId" element={<YourPostsSection />} />
        <Route path="/feed/yourposts/:userId" element={<YourPostsSection />} />
        <Route path="/connections" element={<ConnectionSection />} />
        <Route
          path="/feed"
          element={
            isLoggedin ? (
              <Feed />
            ) : (
              <Navigate to="/" replace state={{ from: "/feed" }} />
            )
          }
        />
        {/* Redirect to Loginpage if the user tries to access any other route */}
        <Route element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
