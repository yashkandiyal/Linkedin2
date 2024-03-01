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
      className="hidden lg:block border rounded-xl bg-[#ffffff] w-56 p-4 shadow-xl h-fit"
    >
      <h1 className="text-xl text-center font-semibold mb-4">LinkedIn News</h1>
      <ul className="list-disc pl-6 h-fit">
        {newsItems.map((news, index) => (
          <li key={index} className="text-gray-700 mb-2 lg:text-[0.95rem]">
            {news}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightFeedSection;
