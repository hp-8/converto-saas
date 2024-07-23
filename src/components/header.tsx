"use client";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
      <div className="text-2xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
            Converto - JPG to PDF</div>
        <div className="ml-6 text-sm text-gray-300">© 2024 by HP Creates</div>
      </div>
    </header>
  );
};

export default Header;
