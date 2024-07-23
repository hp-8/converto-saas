"use client";

import React from "react";
import Header from "@/components/header";
import UploadInput from "@/components/upload/uploadInput";

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow justify-center items-center">
        <div className="text-center p-6 bg-white shadow-xl rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Convert Image to PDF</h1>
          <UploadInput />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
