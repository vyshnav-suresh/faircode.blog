import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full px-8 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
      <span>
        &copy; {new Date().getFullYear()} faircode.blog. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
