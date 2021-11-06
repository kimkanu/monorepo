import React from 'react';

const ClassAddButton: React.FC = (
) => (
  <div>
    <button type="button" className="justify-center group rounded-md w-full h-48 sm:flex hover:border-transparent hover:shadow-lg items-center border-4 border-dashed border-gray-200">
      <div>
        <div className="text-8xl text-center text-gray-700 font-black"> &#43; </div>
        <div className="text-lg text-center text-gray-700 font-semibold mb-4"> Join/Create New Class </div>
      </div>
    </button>
  </div>
);

export default ClassAddButton;
