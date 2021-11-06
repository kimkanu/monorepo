import { Circle12Filled, Star16Filled } from '@fluentui/react-icons';
import React from 'react';

interface Props {
  courseName: string;
  live: boolean;
  my: boolean;
}

const ClassButton: React.FC<Props> = ({ courseName, live, my }) => (
  <div>
    <button type="button" className="group rounded-md bg-gray-200 w-full h-48 sm:flex font-semibold items-center hover:bg-blue-300 hover:shadow-lg">
      <div className="m-4">
        {
          live && (
            <div className="text-sm text-red-500 text-left">
              <Circle12Filled className="animate-pulse mr-4 ml-0.5 -mb-0.5 inline-block" />
              <div className="inline-block"> Live </div>
            </div>
          )
        }
        {
          my && (
            <div className="text-sm text-blue-500 text-left py-0.5 flex items-center">
              <div className="inline-block">
                <Star16Filled className="mr-4 pt-2 inline-block" />
              </div>
              <div className="inline-block"> My </div>
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
