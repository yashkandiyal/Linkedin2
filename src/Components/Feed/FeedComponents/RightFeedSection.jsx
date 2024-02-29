import React from "react";

const RightFeedSection = () => {
  const newsItems = [
    "New jobs available in tech sector",
    "LinkedIn introduces new messaging feature",
    "Top 10 tips for effective networking",
    "Latest trends in remote work",
    "How to optimize your LinkedIn profile",
    "Career advancement strategies for 2022",
  ];

  return (
    <div
      id="right"
      className="hidden md:block border rounded-xl bg-[#ffffff] w-56 p-4 h-96 shadow-xl"
    >
      <h1 className="text-xl text-center font-semibold mb-4">LinkedIn News</h1>
      <ul className="list-disc pl-6">
        {newsItems.map((news, index) => (
          <li key={index} className="text-gray-700 mb-2 text-[0.95rem]">
            {news}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightFeedSection;
