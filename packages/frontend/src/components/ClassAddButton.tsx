import React from 'react';

const ClassAddButton: React.FC = (
) => (
  <div>
    <button type="button" className="justify-center group rounded-lg w-full h-48 bg-gray-300 sm:flex items-center hover:shadow-class-hover">
      <div>
        <div className="text-title text-center text-gray-700 font-black"> &#43; </div>
        <div className="text-big text-center text-gray-700 font-semibold mb-4"> Join/Create New Class </div>
      </div>
    </button>
  </div>
);

export default ClassAddButton;
