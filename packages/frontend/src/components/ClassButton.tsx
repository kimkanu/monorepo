import React from 'react';

interface Props {
  courseName: string;
  isLive: boolean;
  isMine: boolean;
}

const ClassButton: React.FC<Props> = ({ courseName, isLive, isMine }) => (
  <div>
    <button type="button" className="group rounded-md bg-gray-200 w-full h-48 sm:flex font-semibold items-center hover:bg-blue-300 hover:shadow-lg">
      <div className="m-4">
        {
          isLive && (
            <div className="text-sm text-red-500 text-left">
              <div className="inline-block animate-pulse rounded-full h-3 w-3 bg-red-500" />
              <div className="inline-block ml-4"> Live </div>
            </div>
          )
        }
        {
          isMine && (
            <div className="text-sm text-blue-500 text-left py-0.5 flex items-center">
              <div className="inline-block">
                <svg width="16" height="20" fill="currentColor">
                  <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                </svg>
              </div>
              <div className="inline-block ml-4"> My </div>
            </div>
          )
        }
        <div className="mt-8 text-lg text-center text-gray-700 group-hover:text-white">
          {courseName}
        </div>
      </div>
    </button>
  </div>
);

export default ClassButton;
