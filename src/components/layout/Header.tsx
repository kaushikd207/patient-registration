import React from "react";
import { Search } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
